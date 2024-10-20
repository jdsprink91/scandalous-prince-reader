import { IDBPDatabase, openDB } from "idb";
import { SPDB } from "../types/database";

let spdb: IDBPDatabase<SPDB> | null = null;

export async function getSPDB(): Promise<IDBPDatabase<SPDB>> {
  if (spdb === null) {
    spdb = await openDB<SPDB>("sp-db", 1, {
      upgrade(db) {
        db.createObjectStore("feed", { keyPath: "link" });
        db.createObjectStore("feed-item", { keyPath: "guid" });
        db.createObjectStore("feed-item-playback", { keyPath: "feedItemGuid" });
      },
    });
  }

  return spdb;
}
