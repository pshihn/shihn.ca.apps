import { openDB, IDBPDatabase, DBSchema } from 'idb';
import { StippleInfo } from 'stipple/lib/stipple';

const DB_VERSION = 1;
const DB_NAME = 'stipplings';
const STORE_IMAGE_DATA = 'stippled-images';

interface StippledImageSchema extends DBSchema {
  'stippled-images': {
    key: string;
    value: StoredStipplInfo
  };
}

export interface StoredStipplInfo extends StippleInfo {
  url: string;
}

export class StippledDB {
  private db?: IDBPDatabase<StippledImageSchema>;

  async initialize() {
    try {
      this.db = await openDB<StippledImageSchema>(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion) {
          if (!oldVersion) {
            db.createObjectStore(STORE_IMAGE_DATA, { keyPath: 'url' });
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async addInfo(url: string, settings: StippleInfo) {
    if (this.db) {
      this.db.put(STORE_IMAGE_DATA, {
        url,
        ...settings
      });
    }
  }

  async getInfo(url: string): Promise<StippleInfo | null> {
    if (this.db) {
      return (await this.db.get(STORE_IMAGE_DATA, url)) || null;
    }
    return null;
  }
}

let edb: StippledDB;
export async function db(): Promise<StippledDB> {
  if (!edb) {
    edb = new StippledDB();
  }
  await edb.initialize();
  return edb;
}