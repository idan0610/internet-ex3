/**
 * Created by owner on 28/12/2015.
 */

/**
 * request object constructor.
 * @param _method - The type of the request.
 * @param _URL - the URL of the asked file.
 * @param _ver HTTP protocol version.
 * @param _fields list of headers of the request.
 * @param _body body of request.
 * @param _connection status of connection of request
 */
var requestObject = function(_method, _URL, _ver, _fields, _body,_connection) {
    this.method = _method;
    this.URL = _URL;
    this.ver = _ver;
    this.fields = _fields;
    this.body = _body;
    this.connection = _connection;
};

/**
 * 400 Bad Request Error
 */
var badRequest = function () {
    this.code = 400;
};
badRequest.prototype = Error.prototype;

/**
 * Parsing the request from the client
 * @param requestSTR The request at string format
 * @returns {requestObject}
 */
var parse = function(requestSTR) {
    var requestArray = requestSTR.replace(/(\r\n|\n|\r)/gm, "\n").split("\n");

    //read first line
    var firstLine = requestArray[0].trim().replace(/\s{2,}/g, ' ').split(" ");
    if (firstLine.length !== 3) {
        throw new badRequest;
    }
    var method = firstLine[0];
    var URL = firstLine[1];
    var ver = firstLine[2].toLowerCase();

    //read fields
    var connection = "";
    var i = 1;
    var fields = [];
    var pat = new RegExp(".+:.+");
    while (requestArray[i] !== "" ) {
        if (pat.test(requestArray[i])) {
            var field = requestArray[i].split(/:(.+)?/);
            field[0] = field[0].trim();
            field[1] = field[1].trim();
            if (field[0].toLowerCase() === "connection"){
                connection = field[1].toLowerCase();
            }
            fields.push({
                key: field[0],
                value: field[1]
            });
        } else {
            throw new badRequest;
        }

        i++;
    }

    // read body
    i++;
    var body = {};
    while (i < requestArray.length) {
        if (requestArray[i] !== ""){
            body.push(requestArray[i]);
        }
        i++;
    }

    return new requestObject(method, URL, ver, fields, body, connection);
};

exports.parse = parse;
exports.badRequest = badRequest;