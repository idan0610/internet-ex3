var hujiwebserver = require('../hujiwebserver');
var http = require('http');
var port = 8080;

var server = hujiwebserver.start(port, "./ex2", function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Connected to server!");
    }
});

// loading ex2 -should work as expected
function test(path, size, message, prediction) {
    var options = {
        host: '127.0.0.1',
        port: port,
        path: path
    };

    var req = http.get(options, function (res) {

        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];

        res.on('data', function (chunk) {
            bodyChunks.push(chunk);
        }).on('end', function () {
            console.log(message);
            console.log("Expected: " + prediction);
            console.log((res.headers['content-length'] == size) ? "Actual: Success" :
                "Actual: Failed");
        })
    });

    req.on('error', function (e) {
        console.log('ERROR: ' + e.message);
    });
}

test("../index.html", 130, "Asking the server to upon an unreachable file."," Failed");
test("/index2.html", 100, "Asking the server for non exist file." ,"Failed");
test("index.rar", 170, "Asking the server for unsupported file format."," Failed");
test("/index.html", 180, "Asking the server to supply the ex2 files.", "Success");
