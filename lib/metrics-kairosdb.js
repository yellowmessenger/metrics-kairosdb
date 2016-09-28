var kdb = require('kairosdb');
var hostname = require('os').hostname();

var client = kdb.init("10.0.0.29",8080,{});

var sendData = function(metric,value,tags){
    if(Object.keys(tags).length>0){
        var data = [{
            "name": metric,
            "timestamp": new Date().getTime(),
            "value": 1,
            "tags": tags
        }];

        client.datapoints(data, function (err, result) {
            if (err)
                throw err;
        });
    }
};

var serverStats =  function(options) {
    return function(req, res, next) {
        var startTime = new Date().getTime();
        var path = req.path.replace(/\./g, '-').replace(/\//g, '-');

        if(path != "-" && path[path.length-1]=="-"){
            path = path.substring(0,path.length-1);
        }

        // Function called on response finish that sends stats to statsd
        function sendStats() {
            if (hostname.indexOf("local") != -1) {
                cleanup();
                return;
            }
            var app = options.app;
            var key = hostname + "."+path;


            // Status Code
            var statusCode = res.statusCode || 'unknown_status';

            // Increment
            sendData("server-stats.count."+app,1,{
                "node": hostname,
                "status-code":statusCode,
                "path":path
            });


            // Response Time
            var duration = new Date().getTime() - startTime;
            // Duration
            sendData("server-stats.response-time."+app,duration,{
                "node": hostname,
                "path":path
            });

            cleanup();
        }

        // Function to clean up the listeners we've added
        function cleanup() {
            res.removeListener('finish', sendStats);
            res.removeListener('error', cleanup);
            res.removeListener('close', cleanup);
        }

        // Add response listeners
        res.once('finish', sendStats);
        res.once('error', cleanup);
        res.once('close', cleanup);

        if (next) {
            next();
        }
    }
};


var increment =  function(metric,tags) {
    sendData(metric,1,tags);
};

module.exports =  {
    serverStats:serverStats,
    increment:increment
};