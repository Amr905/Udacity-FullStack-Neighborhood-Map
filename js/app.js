var map;
var viewModel = function () {

    this.locationplaces = [];
    this.markers = [];

    this.query = ko.observable("");

    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
        }
    }

    this.initMap = function () {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 30.091947, lng: 31.618956},
            zoom: 14,
            mapTypeId: 'satellite',
            mapTypeControl: false
        });
        // These are the real estate listings that will be shown to the user.
        // Normally we'd have these in a database instead.

        var largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();
        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < mylocations.length; i++) {
            // Get the position from the location array.
            var position = mylocations[i].location;
            var title = mylocations[i].title;
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: i
            });
            // Push the marker to our array of markers.
            this.markers.push(marker);
            this.markers[i].setMap(map);
            bounds.extend(this.markers[i].position);
            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function () {
                populateInfoWindow(this, largeInfowindow);
            });
        }
        map.fitBounds(bounds);
        //document.getElementById('show-listings').addEventListener('click', showListings);
        // document.getElementById('hide-listings').addEventListener('click', hideListings);
    }

    this.initMap();


    this.locations = ko.computed(function () {


        var locations = [];
        for (var i = 0; i < this.markers.length; i++) {
            if (this.markers[i].title.toLowerCase().includes(this.query().toLowerCase())) {
                locations.push(this.markers[i]);
                this.markers[i].setMap(map);
            } else {
                this.markers[i].setMap(null);
            }

        }
        return locations;
    }, this);


};

function startUp() {
    ko.applyBindings(new viewModel());
}