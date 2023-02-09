# data-forge-redis

The redis module for use with [Data-Forge](https://github.com/data-forge/data-forge-ts) and recoded from [data-forge-fs](https://github.com/data-forge/data-forge-fs).

Supposedly, we have a series of data that has been stored in the redis database. 

Unlike the module of data-forge-fs, the data structure of the securities is constructed as follows:

KEY                 FIELD               VALUE
[PREFIX]SYMBOL      YYYYMMDD          {"O": XX.XXX, "C": XX.XXX, "H": XX.XXX, "L": XX.XXX}

This library contains the redis extensions to Data-Forge.

The example code is listed as follows:

```nodejs
const dataForge = require('data-forge');
const dataForgeRedis = require('data-forge-redis');
require('data-forge-indicators'); 

var toDate = new Date();
toDate.setDate(toDate.getDate() - 8); // get the last 7 days data, today's data is not imported
var fromDate = new Date(toDate.getTime());

const options = {
    host: localhost,
    port: 3679,
    database: 11
};

// async call, please use it in a async function, otherwise it will cause issues
var dataFrame = await dataForgeRedis.fromRedis(options).load(symbol, fromDate, toDate);

// for symbol that is stored with a prefix
// var dataFrame = await dataForgeRedis.fromRedis(options).load(symbol, fromDate, toDate, 'asx:price:');

var inputSeries = dataFrame.parseDates('date').setIndex('date').renameSeries({date: 'time'});



```

[Click here for Data-Forge FS API docs](https://data-forge.github.io/data-forge-fs/index.html)

See [Data-Forge docs](https://github.com/data-forge/data-forge-ts) and [guide](https://github.com/data-forge/data-forge-ts/blob/master/docs/guide.md) for details on how to use.

## For company code changes

```
// for symbol that is stored with a prefix and code changes data is stored with a prefix as well
var dataFrame = await dataForgeRedis.fromRedis(options).load(symbol, fromDate, toDate, 'asx:price:', 'asx:cc');
```

## Maintainer

[Eric Tang](https://twitter.com/_e_tang) @ [TYO Lab](http://tyo.com.au)
