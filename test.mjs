import { generateMockData } from './src/utils/mockData.js';
import { analyzeUnified2D, calculateCauScore, generateReversibleSet, analyzeSingleDigits, analyzeTong, generateReversibleSetFromDan, predictTXCL } from './src/utils/statistics.js';

const rawData = generateMockData(15);
const scoredSingles = analyzeSingleDigits(rawData);
const scoredTongs = analyzeTong(rawData);
const scored2D = analyzeUnified2D(rawData);
const cauScore = calculateCauScore(scored2D, scoredTongs, scoredSingles);
const dan20 = generateReversibleSet(cauScore, 20);
const dan10 = generateReversibleSetFromDan(dan20, cauScore, 10);
const dan4 = generateReversibleSetFromDan(dan10, cauScore, 4);
console.log("Dan 20:", dan20);
console.log("Dan 10:", dan10);
console.log("Dan 4:", dan4);
