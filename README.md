# toastie
Tinder for restaurants, programmed in a day
---
I felt like a bit of a challenge, so I decided that I'd sit myself down for a day, and see how much I can get done.
Whilst it's still a little rough around the edges, it functions as a minimum viable product, and functions to a usable point.

If I we're to continue to develop this (not likely as it was meant to be a once off challenge), I'd make it more responseive
for desktops and larger phones, bundle it into a Progressive Web App and smoothen the experience out a little more, with nicer
transitions and a better integration with server side features.

It utilises the Google Maps Places API for getting nearby restaurants (many of which are hotels for some irritating reason)
and Firebase Cloud Functions for processing the request. I also implemented Firestore Realtime Database to enable communication
between two clients in the same 'room', so the database can be monitored for a match from the client side (through the use of
the Firebase SDK) which greatly reduces overhead and the complexity of the project!
