import { IDBPDatabase, openDB } from "idb";
import { SPDB } from "../types/database";

let spdb: IDBPDatabase<SPDB> | null = null;

export async function getSPDB(): Promise<IDBPDatabase<SPDB>> {
  if (spdb === null) {
    spdb = await openDB<SPDB>("sp-db", 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore("feed", { keyPath: "link" });
          const feedItemStore = db.createObjectStore("feed-item", {
            keyPath: "guid",
          });
          feedItemStore.createIndex("by-iso-date", "isoDate");
          feedItemStore.createIndex("by-feed-link", "feedLink");

          const feedItemPlayback = db.createObjectStore("feed-item-playback", {
            keyPath: "url",
          });
          feedItemPlayback.createIndex("url", "url");
        }

        if (oldVersion === 1) {
          db.deleteObjectStore("feed-item");
        }
      },
    });
  }

  return spdb;
}
