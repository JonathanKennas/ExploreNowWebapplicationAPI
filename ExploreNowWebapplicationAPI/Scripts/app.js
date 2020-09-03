var ViewModel = function () {
    var self = this;
    self.activities = ko.observableArray();
    self.error = ko.observable();
    self.detail = ko.observable();
    self.categories = ko.observableArray();
    self.newActivity = {
        Category: ko.observable(),
        Name: ko.observable(),
        Description: ko.observable(),
        Latitude: ko.observable(),
        Longitude: ko.observable()
    }

    var activitiesUri = '/api/activities/';
    var categoriesUri = '/api/categories/';

    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            self.error(errorThrown);
        });
    }

    // Hämtar alla aktiviteter
    function getAllActivities() {
        ajaxHelper(activitiesUri, 'GET').done(function (data) {
            self.activities(data);
        });
    }

    // Hämtar all data från specifik aktivitet
    self.getActivityDetail = function (item) {
        ajaxHelper(activitiesUri + item.Id, 'GET').done(function (data) {
            self.detail(data);
        });
    }

    // Hämtar alla kategorier
    function getCategories() {
        ajaxHelper(categoriesUri, 'GET').done(function (data) {
            self.categories(data);
        });
    }

    // Lägger till aktivitet och knyter det till en kategori
    self.addActivity = function (formElement) {
        var activity = {
            CategoryId: self.newActivity.Category().Id,
            Name: self.newActivity.Name(),
            Description: self.newActivity.Description(),
            Latitude: self.newActivity.Latitude(),
            Longitude: self.newActivity.Longitude()
        };

        ajaxHelper(activitiesUri, 'POST', activity).done(function (item) {
            self.activities.push(item);
        });
    }

    // Google maps
    loadMapsJSAPI();

    function runApp() {
        console.log('Maps JS API loaded');
        const map = displayMap();
        const markers = addMarkers(map);
        clusterMarkers(map, markers);
        addPanToMarker(map, markers);
    }

    function loadMapsJSAPI() {
        const googleMapsAPIKey = 'AIzaSyClQVtfHOJaUG2YXyLbtbJ73Jm__81vaTU';
        const googleMapsAPIURI = `https://maps.googleapis.com/maps/api/js?key=${googleMapsAPIKey}&callback=runApp`;
        const script = document.createElement('script');

        script.src = googleMapsAPIURI;
        script.defer = true;
        script.async = true;

        window.runApp = runApp;
        document.head.appendChild(script);
    }

    function displayMap() {
        const mapOptions = {
            center: { lat: -33.860664, lng: 151.208138 },
            zoom: 14
        };
        const mapDiv = document.getElementById('map');
        return new google.maps.Map(mapDiv, mapOptions);
    }

    function addMarkers(map) {
        //const locations = {
        //    operaHouse: { lat: -33.8567844, lng: 151.213108 },
        //    tarongaZoo: { lat: -33.8472767, lng: 151.2188164 },
        //    manlyBeach: { lat: -33.8209738, lng: 151.2563253 },
        //    hyderPark: { lat: -33.8690081, lng: 151.2052393 },
        //    theRocks: { lat: -33.8587568, lng: 151.2058246 },
        //    circularQuay: { lat: -33.858761, lng: 151.2055688 },
        //    harbourBridge: { lat: -33.852228, lng: 151.2038374 },
        //    kingsCross: { lat: -33.8737375, lng: 151.222569 },
        //    botanicGardens: { lat: -33.864167, lng: 151.216387 },
        //    museumOfSydney: { lat: -33.8636005, lng: 151.2092542 },
        //    maritimeMuseum: { lat: -33.869395, lng: 151.198648 },
        //    kingStreetWharf: { lat: -33.8665445, lng: 151.1989808 },
        //    aquarium: { lat: -33.869627, lng: 151.202146 },
        //    darlingHarbour: { lat: -33.87488, lng: 151.1987113 },
        //    barangaroo: { lat: - 33.8605523, lng: 151.1972205 }
        //}
        var allLocations = getAllActivities();

        const locations = allLocations.Latitude + allLocations.Longitude;
        const markers = [];
        for (const location in locations) {
            const markerOptions = {
                map: map,
                position: locations[location],              
                icon: "/Images/Fishmarker.png"
            }
            const marker = new google.maps.Marker(markerOptions);
            markers.push(marker);
        }
        return markers;
    }

    function clusterMarkers(map, markers) {
        const clustererOptions = { imagePath: "/Images/Skiermarker.png" }
        const markerCluster = new MarkerClusterer(map, markers, clustererOptions);
    }

    function addPanToMarker(map, markers) {
        let circle;
        markers.map(marker => {
            marker.addListener('click', event => {
                const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
                map.panTo(location);
                if (circle) {
                    circle.setMap(null);
                }
                circle = drawCircle(map, location);
            });
        });
    }

    function drawCircle(map, location) {
        const circleOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            map: map,
            center: location,
            radius: 800
        }
        const circle = new google.maps.Circle(circleOptions);
        return circle;
    }

    // Hämtar första datan vid inladdning av sida.
    getAllActivities();
    getCategories();
};

ko.applyBindings(new ViewModel());