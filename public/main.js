// Constants
const c = {
    notificationTimeout: 5000
}

// Globals
let g = {};

// Dom elements
function d(id) {
    return document.getElementById(id);
}
const dom = {
    pages: {
        landing: d("landing"),
        swipe: d("swipe")
    },
    buttons: {
        join: d("join"),
        create: d("create"),
        no: d("no"),
        yes: d("yes")
    },
    inputs: {
        groupId: d("groupIdInput")
    },
    groupId: d("groupId"),
    notification: {
        el: d("notification"),
        text: d("notificationText")
    },
    loader: d("loader")
}

function init() {
    addEventListeners();

    getLocation().then((location) => {
        request("/nearby", location).then(console.log);
    });
}

function addEventListeners() {
    dom.buttons.join.addEventListener("click", () => {
        // Show the group id input
        dom.inputs.groupId.classList.add("join");
        dom.inputs.groupId.focus();
    });
    dom.inputs.groupId.addEventListener("blur", () => {
        // Hide the group id input
        dom.inputs.groupId.classList.remove("join");
    }); 
    dom.inputs.groupId.addEventListener("keypress", (e) => {
        // Validate the group id and switch the page
        if (e.key == "Enter") joinGroup(dom.inputs.groupId.value).then(() => {
            showPage(dom.pages.swipe);
        }).catch((e) => {
            notify("Invalid group id!");
            console.error(e);
        });
    });

    dom.buttons.create.addEventListener("click", () => {
        // Request location, then a new group id and show it to the user
        getLocation().then((location) => {
            g.location = location;

            createGroup().then((groupId) => {
                notify(`Your group id: ${groupId} (it's been copied)`);
                showPage(dom.pages.swipe);
            }).catch((e) => {
                notify("Something went wrong when making a group id :(");
                console.error(e);
            });
        }).catch((e) => {
            notify(e);
            console.error(e);
        });
    });
}

function showPage(page) {
    // Blur the active element when switching pages
    document.activeElement.blur();

    // Switch the page
    document.getElementsByClassName("active")[0].classList.remove("active");
    page.classList.add("active");
}

// Sends a notification and removes it if it was the last one to be sent
function notify(message) {
    dom.notification.text.innerText = message;
    dom.notification.el.classList.add("active");
    
    let timeoutId = Date.now();

    setTimeout((currentId) => {
        if (g.lastNotification == currentId) {
            dom.notification.el.classList.remove("active");
        }
    }, c.notificationTimeout, timeoutId);
    g.lastNotification = timeoutId;
}

// Starts the loader and disabled buttons
function startLoad() {
    dom.loader.classList.add("active");

    disableButtons();

    let loadId = Date.now();
    g.lastLoad = loadId;
    return loadId;
}
// Stops the loader, re-enabling buttons
function stopLoad(loadId) {
    if (loadId == g.lastLoad) {
        enableButtons();
        dom.loader.classList.remove("active");
    }
}

// Disable all buttons
function disableButtons() {
    Object.keys(dom.buttons).forEach(key => dom.buttons[key].classList.add("disabled"));
}
// Enable all buttons
function enableButtons() {
    Object.keys(dom.buttons).forEach(key => dom.buttons[key].classList.remove("disabled"));
}

init();