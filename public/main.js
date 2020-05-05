// Constants

// Globals

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
}

function init() {
    addEventListeners();
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
        if (e.key == "Enter") validateGroupId(dom.inputs.groupId.value).then(() => {
            showPage(dom.pages.swipe);
        }).catch((e) => {
            console.error(e);
        });
    });
}

function showPage(page) {
    document.getElementsByClassName("active")[0].classList.remove("active");
    page.classList.add("active");
}

init();