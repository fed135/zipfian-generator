/**
 * Generates test samples
 */

/* Requires ------------------------------------------------------------------*/

const fs = require('fs');
const path = require('path');

/* Methods -------------------------------------------------------------------*/

async function generate(alpha, sampleSize, variants, outfile, push) {
    const handle = prepareOutput(alpha, sampleSize, variants, outfile, push);
    console.log('Preparing dictionary');
    const idDistribution = generateZetaDistribution(alpha, sampleSize);
    console.log('Dictionary ready');
    const variantsDistribution = generateLinearDistribution(variants);
    let i = 0;
    let mod = Math.round(sampleSize / (sampleSize >= 0xfffff ? 100 : 10));
    while(i < sampleSize) {
        if (i % mod === 0 && i !== 0) console.log(`Inserted ${i} entries`);
        await insert(idDistribution, variantsDistribution, handle, i === sampleSize - 1);
        i++;
    }
    console.log(`Inserted ${i} entries`);
    process.exit(0);
}

async function insert(idDistribution, variantsDistribution, handle, lastEntry) {
    return new Promise(res => handle.write(`${bisect(idDistribution, Math.random())} ${roll(variantsDistribution)}${lastEntry ? '' : '\n'}`, res));
}

function generateZetaDistribution(alpha, n) {
    return Array.from(new Array(Math.max(n, 1)))
        .map((a, b) => 1 / Math.pow(b + 1, alpha))
        .reduce((a, b) => { a.push(a[a.length - 1] + b); return a; }, [0])
        .map((a, b, c) => a / c[c.length - 1]);
}

function generateLinearDistribution(n) {
    return Array.from(new Array(Math.max(n, 1)))
        .map((a, b) => b + 1);
}

function roll(distribution) {
    return distribution[Math.floor(Math.random()*distribution.length)];
}

function prepareOutput(alpha, sampleSize, variants, outfile, push) {
    const file = outfile || path.resolve(__dirname, `sample_${alpha}_${sampleSize}_${variants}.txt`);
    console.log(`Generating ${sampleSize} samples with an alpha of ${alpha}, multiplied by ${variants} variations, into ${file} (${push ? 'append' : 'write'})`);
    if (push === true) {
        try { fs.unlinkSync(file); } catch(e) {}
    }
    return fs.createWriteStream(file);
}

function bisect(distribution, u) {
    let i = 0;
    if (distribution.length === 0) return 0;
    for(i; i < distribution.length; i++) {
        if (u < distribution[i]) return i;
    }
    return i;
}

function extractArgValue(tokens, def) {
    return process.argv.find((a, b, c) => b > 0 && tokens.includes(c[b-1])) || def;
}

/* Exports -------------------------------------------------------------------*/

module.exports = { generate };
if (!module.parent) generate(
    Number(extractArgValue(['-a', '--alpha'], 1)),
    Number(extractArgValue(['-s', '--size'], 100000)),
    Number(extractArgValue(['-v', '--variants'], 1)),
    extractArgValue(['-o', '--out'], null),
    Boolean(extractArgValue(['-p', '--push'], false)));
