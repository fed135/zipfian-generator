# zipfian-generator
Generate large data sets with a given z-distribution

## Usage

You can either use it via import:

```
import {generate} from './zipfian-generator';

/**
 * Saves a randomly generated dataset to file
 * @param {number} alpha The s value for the distribution. See (https://en.wikipedia.org/wiki/Zeta_distribution). Default: 1
 * @param {number} sampleSize The number of records to generate, also describes the range of possible identifiers. Default: 100000
 * @param {number} variants The number of individual variants for records (sampleSize * variants), which is applied linearly. Default: 1
 * @param {string} outfile The name of the output file. Default: sample_<alpha>_<sampleSize>_<variants>.txt
 * @param {boolean} push Indicates wether to overrite the outfile (false), if it exists, or append to it (true). Default: false
generate(1,100000,1,'./samples.txt', false);
```

Or via the cli:

```
# -a --alpha      The alpha value for the generate method
# -s --size       The sampleSize value for the generate method
# -v --variants   The variants value for the generate method
# -o --out        The outfile value for the generate method
# -p --push       The push value for the generate method

$ node ./zipfian-generator -a 1 -s 100000 --out "./zipfian-generator" --push true
```

## Contribute

Please do! This is an open source project - if you see something that you want, [open an issue](https://github.com/fed135/zipfian-generator/issues/new) or file a pull request.

I am always looking for more maintainers, as well.


## License 

[Apache 2.0](LICENSE) (c) 2019 Frederic Charette
