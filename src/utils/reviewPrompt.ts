// reviewPrompt.ts
// Shows the Google Play in-app review dialog only after the user has had
// a few good experiences with the app, never on app open.
//
// Install (MMKV is already in your project):
//   npm install react-native-in-app-review

import { MMKV } from 'react-native-mmkv';
import InAppReview from 'react-native-in-app-review';

// ---- Settings you can tune ----
const MIN_MOMENTS = 3; // good moments needed before asking
const MIN_DAYS_SINCE_FIRST_OPEN = 2; // don't ask brand-new users
const DAYS_BETWEEN_ASKS = 30; // wait this long before asking again
const MAX_ASKS = 3; // stop asking after this many tries
// -------------------------------

// Separate MMKV instance so it never clashes with your app's other keys.
// If you prefer, replace this with your existing MMKV instance.
const storage = new MMKV({ id: 'review-prompt' });

const STORAGE_KEY = 'review_prompt_state_v1';
const DAY_MS = 24 * 60 * 60 * 1000;

type ReviewState = {
  firstOpen: number; // timestamp of first app open
  moments: number; // good moments since last ask
  lastAsk: number; // timestamp of last ask (0 = never)
  asks: number; // how many times we asked
};

let inFlight = false;

function saveState(state: ReviewState): void {
  try {
    storage.set(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage failure should never break the app.
  }
}

function loadState(): ReviewState {
  try {
    const raw = storage.getString(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as ReviewState;
    }
  } catch {
    // Fall through and create a fresh state.
  }
  const fresh: ReviewState = {
    firstOpen: Date.now(),
    moments: 0,
    lastAsk: 0,
    asks: 0,
  };
  saveState(fresh);
  return fresh;
}

function shouldAsk(state: ReviewState): boolean {
  const now = Date.now();
  if (state.asks >= MAX_ASKS) return false;
  if (state.moments < MIN_MOMENTS) return false;
  if (now - state.firstOpen < MIN_DAYS_SINCE_FIRST_OPEN * DAY_MS) return false;
  if (state.lastAsk && now - state.lastAsk < DAYS_BETWEEN_ASKS * DAY_MS)
    return false;
  return true;
}

/** Call once when the app starts, so we know when the user first opened it. */
export function initReviewPrompt(): void {
  loadState();
}

/**
 * Call after a good moment, for example:
 *  - a surah finished playing
 *  - the user finished repeating a verse
 *  - the user finished word-by-word listening of a verse
 * It only shows the dialog when all the conditions above are met.
 */
export async function trackPositiveMoment(): Promise<void> {
  if (inFlight) return;
  inFlight = true;
  try {
    const state = loadState();
    state.moments += 1;

    if (!shouldAsk(state) || !InAppReview.isAvailable()) {
      saveState(state);
      return;
    }

    // Record the ask before showing, so a crash can't cause repeat prompts.
    state.lastAsk = Date.now();
    state.asks += 1;
    state.moments = 0;
    saveState(state);

    // Google decides whether the dialog actually appears (it has its own limits).
    // The result does NOT tell you whether the user left a review.
    await InAppReview.RequestInAppReview();
  } catch {
    // Ignore: a failed review prompt should never affect the user.
  } finally {
    inFlight = false;
  }
}
