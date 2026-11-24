import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const qualification = JSON.parse(readFileSync(new URL('../inputs/qualification.json', import.meta.url), 'utf8'));

const { stripe } = await import('../inputs/qualification.mjs');
test('典型条带可稳定重读，逆光和重叠冲突可直接从输入区分', () => {
  const source = stripe(qualification, 5);
  const replacement = stripe(qualification, 5, 1);
  assert.equal(source.length, 8 * 640 * 16);
  assert.deepEqual(source, stripe(qualification, 5));
  assert.notDeepEqual(source, replacement);
  assert.ok(source.some((v) => Math.abs(v) > 100));
  assert.ok(stripe(qualification, 0).every((v) => Math.abs(v) < 0.125));
});
test('编辑跨未到条带，随后换增益、冲突并回收', () => {
  const [publish, , publishAfter, edit, , fill, , gain, , replace, , release] = qualification.reads;
  assert.equal(publish[2], fill[1]);
  assert.equal(fill[2], publishAfter[1]);
  assert.ok(edit[2][1] < 32 && edit[2][3] > 40);
  assert.deepEqual(qualification.gainRevisions.g1.slice(0, 8), qualification.gainRevisions[gain[1]].slice(0, 8));
  assert.ok(replace[1] >= release[1] && replace[1] < release[2]);
  assert.ok(stripe(qualification, 5).byteLength > qualification.maxWorkBytes);
});
