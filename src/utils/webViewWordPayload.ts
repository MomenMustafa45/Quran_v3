export type WordClickPayload = {
  audio: string;
  word: string;
  aya: number;
};

export function encodeWordClickPayload(payload: WordClickPayload): string {
  return encodeURIComponent(JSON.stringify(payload));
}
