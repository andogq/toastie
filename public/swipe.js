function showRestaurant(id) {
    let r = g.restaurants[id];

    dom.restaurant.location.innerText = r.vicinity;
    dom.restaurant.name.innerText = r.name;
    dom.restaurant.rating.innerText = `${r.rating} (${r.user_ratings_total})`;

    dom.restaurant.image.src = `/photo?photoReference=${r.photos[0].photo_reference}`;
}