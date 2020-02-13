import { DitherWorker } from './worker-api';
import { Worker } from './worker';

let _worker: Worker | null = null;

export async function remote(): Promise<DitherWorker> {
  if (!_worker) {
    _worker = new Worker();
  }
  return _worker;
}