# data-forge-redis

The redis module for use with [Data-Forge](https://github.com/data-forge/data-forge-ts) and recoded from [data-forge-fs](https://github.com/data-forge/data-forge-fs).

Supposely, we have a series of data that has been stored in the redis database. 

Unlike the module of data-forge-fs, the data structure of the securities is constructed as follows:

KEY                 FIELD               VALUE
[PREFIX]SYMBOL      YYYYMMDD          {"O": XX.XXX, "C": XX.XXX, "H": XX.XXX, "L": XX.XXX}

This library contains the redis extensions to Data-Forge.

[Click here for Data-Forge FS API docs](https://data-forge.github.io/data-forge-fs/index.html)

See [Data-Forge docs](https://github.com/data-forge/data-forge-ts) and [guide](https://github.com/data-forge/data-forge-ts/blob/master/docs/guide.md) for details on how to use.

#


