function showRestaurant(id) {
    if (g.match) return Promise.resolve();
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
    let nextId = g.currentRestaurant.id + 1;
    if (nextId < g.restaurants.length) return showRestaurant(nextId);
    else {
        notify("There are no more nearby options!");
        disableButtons();
        return Promise.reject();
    }
}

function swipeLeft() {
    if (!g.match) {
        let loadId = startLoad();
        dom.covers.left.classList.add("max");
        return nextRestaurant().finally(() => {
            dom.covers.left.classList.remove("max");
            stopLoad(loadId);
        });
    }
}

function swipeRight() {
    if (!g.match) {
        let loadId = startLoad();
        dom.covers.right.classList.add("max");

        let newDoc;

        if (g.yes.indexOf(g.currentRestaurant.placeId) != -1) {
            newDoc = {
                match: g.currentRestaurant.placeId
            };
            match(g.currentRestaurant.placeId);
        } else newDoc = {
            yes: [...g.yes, g.currentRestaurant.placeId]
        };

        return g.group.doc.update(newDoc).then(nextRestaurant).finally(() => {
            dom.covers.right.classList.remove("max");
            stopLoad(loadId);
        });
    }
}

function match(placeId) {
    g.restaurants.forEach((r, i) => {
        if (r.place_id == placeId) {
            showRestaurant(i);
        }
    });
    dom.pages.swipe.classList.add("match");
    g.match = placeId;
}