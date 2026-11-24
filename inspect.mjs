import {readFileSync} from 'node:fs';
import * as input from './inputs/captures.mjs';

const source=JSON.parse(readFileSync(new URL('./inputs/captures.json',import.meta.url),'utf8'));
console.log(JSON.stringify({名称:'感光条带与模型包',首项:source['shape'],字段:Object.keys(source),取数函数:Object.keys(input)},null,2));
