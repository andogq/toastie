function showRestaurant(id) {
    return new Promise((resolve) => {
        let r = g.restaurants[id];
        g.currentRestaurant = id;
    
        dom.restaurant.location.innerText = r.vicinity;
        dom.restaurant.name.innerText = r.name;
        dom.restaurant.rating.innerText = `${r.rating} (${r.user_ratings_total})`;
    
        dom.restaurant.image.src = `/photo?photoReference=${r.photos[0].photo_reference}`;
        dom.restaurant.image.addEventListener("load", resolve);
    });
}

function nextRestaurant() {
    return showRestaurant(g.currentRestaurant + 1);
}

function swipeLeft() {
    dom.covers.left.classList.add("max");
    return nextRestaurant().then(() => dom.covers.left.classList.remove("max"));
}

function swipeRight() {
    dom.covers.right.classList.add("max");
    return nextRestaurant().then(() => dom.covers.right.classList.remove("max"));
}