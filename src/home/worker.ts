import { Stippler, StippleRequest } from './stippler';
import { StippleInfo } from 'stipple/lib/stipple';
import { db } from './db';

let currentImage = '';

const sendInfo = (info: StippleInfo) => {
  (self as any as Worker).postMessage(info);
};

const callback = async (info: StippleInfo) => {
  sendInfo(info);
  if (currentImage && (info.iteration === 50)) {
    try {
      const url = currentImage;
      (await db()).addInfo(url, info);
    } catch (err) { }
  }
};

const stippler = new Stippler(callback);

self.addEventListener('message', async (event) => {
  const request = event.data as StippleRequest;
  try {
    const cached = await (await db()).getInfo(request.name);
    if (cached) {
      sendInfo(cached);
      return;
    }
  } catch (err) { }
  currentImage = request.name;
  if (!request.iterations) {
    request.iterations = [2, 5, 10, 15, 20, 30, 40, 50];
  }
  stippler.process(request);
});