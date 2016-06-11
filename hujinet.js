/**
 * Created by owner on 29/12/2015.
 */

var fs = require("fs");
var hujirequestparser = require("./hujirequestparser");


/**
 * Response object constructor
 * @param _ver - http version of response
 * @param _status - status of the page (200 ok - fine, otherwise - error has ocuured)
 * @param _contentType - the type of the file provided at response
 * @param _contentLength - size in bytes of the file provided
 * @param _fileStream - a stream object of the file
 * @param _connection - the type of the connection
 */
var responseObject = function (_ver, _status, _contentType, _contentLength, _fileStream, _connection) {
    this.ver = _ver;
    this.status = _status;
    this.contentType = _contentType;
    this.contentLength = _contentLength;
    this.fileStream = _fileStream;
    this.connection = _connection;
}

/**
 * returns a responseObject
 * @param req - a request object
 * @param rootFolder - the rootFolder of the file requested
 * @returns {responseObject} - for the request
 */
var getResponse = function (req, rootFolder) {
    var badRequest = hujirequestparser.badRequest;

    var InternalServerError = function () {
        this.code = 500;
    };
    InternalServerError.prototype = Error.prototype;

    var NotFound = function () {
        this.code = 404;
    };
    NotFound.prototype = Error.prototype;

    var Forbidden = function () {
        this.code = 403;
    };
    Forbidden.prototype = Error.prototype;

    var types = {
        'js': 'application/javascript',
        'txt': 'text/plain',
        'html': 'text/html',
        'css': 'text/css',
        'jpeg': 'image/jpeg',
        'jpg': 'image/jpg',
        'gif': 'image/gif'
    };

    try {
        var request = hujirequestparser.parse(req);
        // check method
        if (request.method !== "GET") {
            throw new InternalServerError;
        }

        if (request.ver !== "http/1.0" && request.ver !== "http/1.1") {
            throw new badRequest;
        }

        var ver = request.ver;
        var connection = "";
        if ((ver === "http/1.0" && request.connection !== "keep-alive") || request.connection === "close") {
            connection = "close";
        }
        else {
            connection = "keep-alive";
        }

        if(request.URL.indexOf("..") != -1) {
            throw new Forbidden;
        }

        try {
            var stats = fs.statSync(rootFolder + request.URL);
        }
        catch (e) {
            throw new NotFound;
        }

        if(!stats.isFile()) {
            throw new Forbidden;
        }

        var postfix = request.URL.substr(request.URL.lastIndexOf('.')+1);
        if (!(postfix in types)) {
            throw new Forbidden;
        }
        var fileStream = fs.createReadStream(rootFolder + request.URL);
        var contentType = types[postfix];
        var contentLength = stats.size;

        return new responseObject(ver, "200 OK", contentType, contentLength, fileStream, connection);
    }
    catch (e) {
        if (e.code === 400) {
            return new responseObject("http/1.1", "400", null, null, null, "");
        }
        else if (e.code === 404) {
            return new responseObject("http/1.1", "404", null, null, null, "");
        }
        else if (e.code === 403) {
            return new responseObject("http/1.1", "403", null, null, null, "");
        }
    }
};

exports.getResponse = getResponse;