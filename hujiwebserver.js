/**
 * Created by Idan Refali & Jonathan Heiss on 24/12/2015.
 */

var fs = require("fs");
var net = require("net");
var hujinet = require("./hujinet");

/**
 * A pattern of the server object.
 * @param port - port of communication
 * @param rootFolder - source folder for the server to use
 * @param callback - method called when the process of creating server ends.
 */
function serverObject(port, rootFolder, callback) {

    var InternalServerError = function () {
        this.code = 500;
    };
    InternalServerError.prototype = Error.prototype;

    var checkRootFolder = function(rootFolder) {
        var stats = fs.statSync(rootFolder);

        return stats.isDirectory();
    };

    if(checkRootFolder(rootFolder)) {
        this.server = net.createServer(function (socket) {

            // Set timeout for new socket
            socket.setTimeout(2000);
            socket.on("timeout", function () {
                socket.end();
            });

            socket.on("data", function(data) {
                var response = hujinet.getResponse(data.toString("utf8"), rootFolder);
                if(response.status === "200 OK") {
                    socket.write(response.ver.toUpperCase() + " " + response.status + "\r\n");
                    socket.write("Connection: " + response.connection + "\r\n");
                    socket.write("Content-Type: " + response.contentType + "\r\n");
                    socket.write("Content-Length: " + response.contentLength + "\r\n\r\n");
                    response.fileStream.pipe(socket, {end:response.connection !== "keep-alive"});
                }
                else {
                    socket.write(response.ver.toUpperCase() + " " + response.status + "\r\n");
                    socket.write("Connection: " + response.connection + "\r\n");
                    socket.write("Content-Type: text/plain\r\n");
                    socket.write("Content-Length: 11\r\n\r\n");
                    socket.write(response.status + " Error\r\n");
                }

                if (response.connection !== "keep-alive") {
                    socket.end();
                }
            })

        });

        this.server.on("error", function(err) {
            // port format is incorrect
            if(err.errno === "EACCES") {
                callback(InternalServerError("HTTP/1.1 500\nThe port number '" + port + "' is not valid!"));
            }
            // port in use
            else if(err.errno === "EADDRINUSE") {
                callback(InternalServerError("HTTP/1.1 500\nThe port number '" + port + "' is already in use!"));
            }
            else {
                callback(err);
            }
        });

        this.server.listen(port, callback);
    }
    else {
        callback(InternalServerError("HTTP/1.1 500\nRoot folder '" + rootFolder + "' is not valid"));
        this.server = null;
    }

    this.stop = function(callback) {
        if (this.server)
        {
            this.server.close(callback);
        }
    };
}

/**
 * The start function. Creates a server Object.
 * A pattern of the server object.
 * @param port - port of communication
 * @param rootFolder - source folder for the server to use
 * @returns {serverObject}
 */
function start(port, rootFolder, callback) {
    var serverObj = new serverObject(port, rootFolder, callback);

    Object.defineProperty(serverObj, 'port', {
        get: function() { return port; }
    });

    Object.defineProperty(serverObj, 'rootFolder', {
        get: function() { return rootFolder; }
    });

    return serverObj;
}

exports.start = start;