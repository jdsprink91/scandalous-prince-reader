/* eslint-disable @typescript-eslint/no-explicit-any */
export const globalState: Record<string, any> = {};

export function setTempFeed(feed: any) {
  globalState.feed = feed;
}
