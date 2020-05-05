function createGroupId() {
    let loadId = startLoad();
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 2000, "yeet-1234");
    }).then(joinGroup).finally(() => stopLoad(loadId));
}

function joinGroup(id) {
    let loadId = startLoad();
    return new Promise((resolve, reject) => {
        g.groupId = id;
        dom.groupId.innerText = id;

        setTimeout(resolve, 2000, id);
    }).finally(() => stopLoad(loadId));
}