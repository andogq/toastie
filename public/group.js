function createGroup() {
    let loadId = startLoad();
    return request("/group/new").then((res) => {
        return res.groupId;
    }).then(joinGroup).finally(() => stopLoad(loadId));
}

function joinGroup(groupId) {
    let loadId = startLoad();
    return new Promise((resolve, reject) => {
        db.collection("groups").doc(groupId).get().then((doc) => {
            if (doc.exists) {
                g.group = {
                    id: groupId,
                    doc
                };
                dom.groupId.innerText = groupId;
                resolve(groupId);
            } else reject("Invalid group id");
        });
    }).finally(() => stopLoad(loadId));
}