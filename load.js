var hujiwebserver = require('./hujiwebserver');
var http = require('http');
var port = 8080;

var server = hujiwebserver.start(port, "./tests/ex2", function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Connected to server!");
    }
});

function loadTest() {
    var options = {
        host: '127.0.0.1',
        port: port,
        path: '/funny.jpg'
    };

    var req = http.get(options, function (res) {

        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        console.log("Starting test");

        res.on('data', function (chunk) {
            bodyChunks.push(chunk);
        }).on('end', function () {
            var body = Buffer.concat(bodyChunks);
            console.log((res.headers['content-length'] == 38494) ? "loadTest successfully completed" :
                "loadTest failed");
        })
    });

    req.on('error', function (e) {
        console.log('ERROR: ' + e.message);
    });
}

for (var i = 0; i < 1000; i++) {
    loadTest();
}