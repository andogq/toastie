
function request(url, data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.onload = () => {
            if (xhr.status == 200) resolve(JSON.parse(xhr.responseText));
            else reject(`Error requesting ${url}`);
        };
        xhr.onerror = () => {
            reject(`Error requesting ${url}`);
        };

        xhr.open("POST", url);
        
        if (data) data = JSON.stringify(data);
        xhr.send(data);
    });
}