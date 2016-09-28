# metrics-kairosdb

## Installation

``` bash
npm install git+https://github.com/yellowmessenger/metrics-kairosdb.git#0.1.1 --save
```

## Usage

An example of an express server with metrics-kairosdb:

``` js
var express = require('express');
var serverStats = require('metrics-kairosdb').serverStats;
var app = express();

app.use(serverStats({
    app:"<app-name>"
}));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000);
```

