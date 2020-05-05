function showRestaurant(id) {
    return new Promise((resolve) => {
        let r = g.restaurants[id];

        g.currentRestaurant = {
            id,
            placeId: r.place_id
        };
    
        dom.restaurant.location.innerText = r.vicinity;
        dom.restaurant.name.innerText = r.name;
        dom.restaurant.rating.innerText = `${r.rating} (${r.user_ratings_total})`;
    
        dom.restaurant.image.src = `/photo?photoReference=${r.photos[0].photo_reference}`;
        dom.restaurant.image.addEventListener("load", resolve);
    });
}

function nextRestaurant() {
    return showRestaurant(g.currentRestaurant.id + 1);
}

function swipeLeft() {
    let loadId = startLoad();
    dom.covers.left.classList.add("max");
    return nextRestaurant().then(() => {
        dom.covers.left.classList.remove("max")
    }).finally(() => stopLoad(loadId));
}

function swipeRight() {
    let loadId = startLoad();
    dom.covers.right.classList.add("max");

    let newDoc;

    if (g.yes.indexOf(g.currentRestaurant.placeId) != -1) newDoc = {
        match: g.currentRestaurant.placeId
    };
    else newDoc = {
        yes: [...g.yes, g.currentRestaurant.placeId]
    };

    return g.group.doc.update(newDoc).then(nextRestaurant).then(() => {
        dom.covers.right.classList.remove("max")
    }).finally(() => stopLoad(loadId));
}