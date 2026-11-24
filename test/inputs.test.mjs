import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import { capture } from '../inputs/captures.mjs';

const data=JSON.parse(readFileSync(new URL('../inputs/captures.json',import.meta.url),'utf8'));
test('感光条带与模型包的格式与关联', () => {
  const [h,w,c] = data.shape;
  assert.equal(h / data.stripe, 45);
  assert.equal(c % 4, 0);
  assert.ok(data.banks.every(k => k.length === 9));
  assert.ok(data.settings.every(s => [s.black,s.gain,s.saturation].every(a => a.length === 4)));
  assert.notEqual(data.settings[0].gain[3], data.settings[1].gain[3]);
  const first = capture(0, 1), second = capture(0, 0), middle = capture(21, 1);
  assert.equal(first.length, data.stripe * w * c);
  assert.notEqual(first[501], second[501]);
  assert.ok(middle.some((v,i) => v >= data.settings[1].saturation[(Math.floor(i/(w*c))%2)*2 + Math.floor(i/c)%2]));
  assert.ok(data.rect[2] < w && data.rect[3] < h);
  assert.ok(data.tolerance[1] < data.tolerance[0]);
  assert.ok(data.workBytes < h*w*c*4);
});
