# express-statsd

## Installation

``` bash
npm install git+https://github.com/yellowmessenger/metrics-kairosdb.git#0.1.1 --save
```

## Usage

An example of an express server with express-statsd:

``` js
var express = require('express');
var expressStatsd = require('express-statsd').expressStatsd;
var app = express();

app.use(expressStatsd({
    app:"<app-name>"
}));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000);
```

