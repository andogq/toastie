const functions = require('firebase-functions');
const admin = require("firebase-admin");
const https = require("https");

admin.initializeApp();
let db = admin.firestore();

exports.newGroup = functions.https.onRequest((request, response) => {
    function generateGroupId() {
        function r(n) {
            return Math.floor(Math.random() * n);
        }

        let allowedCharacters = "abcdefghijklmnopqrstuvqxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let groupId = "";
        while (groupId.length < 10) {
            groupId += allowedCharacters.charAt(r(allowedCharacters.length));
        }

        return db.collection("groups").doc(groupId).get().then((doc) => {
            if (doc.exists) return generateGroupId();
            else return groupId;
        });
    }

    new Promise((resolve, reject) => {
        generateGroupId().then((groupId) => {
            return db.collection("groups").doc(groupId).create({yes: []}).then(() => {
                resolve({groupId});
            });
        }).catch(reject);
    }).then((body) => {
        response.statusCode = 200;
        response.send(JSON.stringify(body));
        response.end();
    }).catch(() => {
        response.statusCode = 404;
        response.end();
    });
});

exports.photo = functions.https.onRequest((request, response) => {
    if (request.method == "GET" && request.query.photoReference) {
        https.get(`https://maps.googleapis.com/maps/api/place/photo?photoreference=${request.query.photoReference}&maxwidth=1000&key=${functions.config().places.key}`, (res) => {
            response.statusCode = res.statusCode;
            response.set(res.headers);
            res.pipe(response);
        });
    } else {
        response.statusCode = 404;
        response.end();
    }
});

exports.nearby = functions.https.onRequest((request, response) => {
    function nearby(lat, lon) {
        return new Promise((resolve, reject) => {
            // Make the request
            https.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=10000&type=restaurant&key=${functions.config().places.key}`, (res) => {
                if (res.statusCode != 200) reject();
                else {
                    // Get the response
                    res.setEncoding("utf8");
                    let data = "";
                    res.on("data", d => data += d);
                    res.on("end", () => {
                        try {
                            data = JSON.parse(data);
                        } catch {
                            reject();
                        }

                        if (typeof(data) != "string" && data.status == "OK") {
                            resolve(data.results);
                        } else reject();
                    });
                }
            });
        });
    }

    new Promise((resolve, reject) => {
        if (request.method == "POST") {
            let lat, lon;
            try {
                let body = JSON.parse(request.body);
                lat = body.lat;
                lon = body.lon;
            } catch {
                reject();
            }

            if (lat && lon) {
                nearby(lat, lon).then((results) => {
                    resolve(results);
                }).catch(reject);
            } else reject();
        } else {
            reject();
        }
    }).then((body) => {
        response.statusCode = 200;
        response.send(JSON.stringify(body));
        response.end();
    }).catch(() => {
        response.statusCode = 404;
        response.end();
    });
});
