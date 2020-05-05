function getLocation() {
    let loadId = startLoad();
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) reject("Geolocation not supported");
        else {
            navigator.geolocation.getCurrentPosition((pos) => {
                let coords = {
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude
                }
                resolve(coords);
            }, () => reject("There was a problem getting your position"));
        }
    }).finally(() => stopLoad(loadId));
}