function createGroup() {
    let loadId = startLoad();
    return request("/group/new").then((res) => {
        return res.groupId;
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