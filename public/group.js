function createGroup() {
    let loadId = startLoad();
    return request("/group/new", g.location).then((res) => {
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
                    doc: db.collection("groups").doc(groupId)
                };

                dom.groupId.innerText = groupId;

                // Set up the doc listeners
                g.group.doc.onSnapshot(docSnapshot);

                resolve(groupId);
            } else reject("Invalid group id");
        });
    }).finally(() => stopLoad(loadId));
}

function docSnapshot(doc) {
    if (doc.exists) {
        let data = doc.data();
        g.restaurants = data.restaurants;
        g.yes = data.yes;
        
        if (!g.currentRestaurant) showRestaurant(0);
        
        if (data.match) {
            console.log("Match!");
        }
    }
}