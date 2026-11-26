import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {WORLD_SCENES,worldScene} from '../src/world-scenes.mjs';
const catalog=JSON.parse(readFileSync(new URL('../src/data/catalog.json',import.meta.url)));
test('all64 worlds resolve to their own artwork and authored atmosphere',()=>{
 assert.deepEqual(Object.keys(WORLD_SCENES).sort(),catalog.map(w=>w.id).sort());
 for(const key of ['poster','scene','loop'])assert.equal(new Set(catalog.map(w=>w[key])).size,64,`${key} is title-matched`);
 for(const w of catalog){for(const key of ['poster','scene','loop'])assert.ok(existsSync(new URL('../public'+w[key],import.meta.url)));assert.ok(WORLD_SCENES[w.id].name);assert.ok(WORLD_SCENES[w.id].particles);assert.ok(!('objects' in WORLD_SCENES[w.id]),'No proxy sculpture models');}
 assert.equal(worldScene('custom-user-world').name,'A world of your own');
});
