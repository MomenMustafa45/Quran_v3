// React Native installs requestIdleCallback/cancelIdleCallback as globals
// (Libraries/Core/setUpTimers.js) but does not ship TypeScript declarations.

interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): number;
}

declare function requestIdleCallback(
  callback: (deadline: IdleDeadline) => void,
  options?: { timeout?: number },
): number;

declare function cancelIdleCallback(handle: number): void;
