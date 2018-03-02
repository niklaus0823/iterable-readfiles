iterable-readfiles
=========================
Node.js module for iterate through all files in a directory.

## Install

```bash
npm install iterable-readfiles -save
```

## How to use

```typescript
import {readfiles, IgnoreType, IgnoreFunction} from 'iterable-readfiles';

// Customize your ignore rule set
let customize: IgnoreFunction = (path: string): boolean => {
    // ignore file：/data1/www/readfiles/package.json
    let shallIgnore = false;
    if (path.indexOf(LibPath.normalize('/data1/www/readfiles/package.json')) !== -1) {
        shallIgnore = true;
    }
    return shallIgnore;
};
// ignore dirname:`node_modules` , regular expression:`*.js`, IgnoreFunction: customize()
let ignores:  Array<IgnoreType> = ['node_modules', '*.js', customize];

readfiles('some/path', ignores)
    .then(files => console.log(files))
    .catch(err => console.log(err));
```

