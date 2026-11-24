import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const d = JSON.parse(readFileSync(new URL('../inputs/session.json', import.meta.url), 'utf8'));

test("两增益的空间输入可读", () => {
  assert.ok(d.rows.length===d.shape[0] && d.rows.every(r=>r.length===d.shape[1]*d.shape[2]));
});

test("卷积核与通道分组一致", () => {
  assert.ok(d.filters.every(f=>f.kernel.length===9 && f.channels.every(c=>c<d.shape[2])));
});

test("编辑请求的核足迹与尚未送达条带有交集", () => {
  assert.ok(d.receivers.preview>d.receivers.edit && d.events[4][0]==='edit' && d.events[4][2]===1);
});

test("典型帧不能完全放进设备工作区", () => {
  assert.ok(d.typical.width*d.typical.height*d.typical.channels*4>d.typical.maxWorkBytes*100);
});
