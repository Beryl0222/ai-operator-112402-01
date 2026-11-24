import {readFileSync} from 'node:fs';
const data = JSON.parse(readFileSync(new URL('./captures.json', import.meta.url), 'utf8'));
export function capture(page, sensor, variant = 0) {
  const [height, width, channels] = data.shape;
  if (!Number.isInteger(page) || page < 0 || page * data.stripe >= height || ![0, 1].includes(sensor)) {
    throw new RangeError('条带或感光路无效');
  }
  const values = new Uint16Array(data.stripe * width * channels);
  for (let y = 0; y < data.stripe; y++) {
    const row = page * data.stripe + y;
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < channels; c++) {
        const i = (y * width + x) * channels + c;
        const sample = (Math.imul((row * width + x) * channels + c + 749, 0x45d9f3b) >>> 20) & 2047;
        const backlight = row >= 156 && row < 184 && x >= 296 && x < 344;
        values[i] = sensor === 1 ? (backlight ? 3320 + sample % 700 : 1024 + sample)
          : 950 + Math.floor(sample / 2) + (variant && x === 319 ? 141 : 0);
      }
    }
  }
  return values;
}
