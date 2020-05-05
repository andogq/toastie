const functions = require('firebase-functions');
const admin = require("firebase-admin");
const https = require("https");

admin.initializeApp();
let db = admin.firestore();

exports.newGroup = functions.https.onRequest((request, response) => {
    db.collection("test").doc("yeet").set({working: true});

    response.end(JSON.stringify({groupId: "yeet-1234"}));
});

exports.nearby = functions.https.onRequest((request, response) => {
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