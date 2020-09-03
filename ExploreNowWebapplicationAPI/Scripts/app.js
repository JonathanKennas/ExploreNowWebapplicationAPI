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
    $(document).ready(function () { 
        Initialize();
    });
    function Initialize() {
        google.maps.visualRefresh = true;
        var start = new google.maps.LatLng(63.1766832, 14.636068099999989); // Startplats Östersund på karta
        var mapOptions = {
            zoom: 5,
            center: start,
            mapTypeId: google.maps.MapTypeId.G_NORMAL_MAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        //GPS-koordinater: https://www.gpskoordinater.com/
        //Inladdning av markörer
        var data = [
            { "Id": 1, "PlaceName": "Forsaleden", "GeoLong": "62.8988458", "GeoLat": "14.967649100000017", "type": "Vandring" },
            { "Id": 2, "PlaceName": "Bydalen", "GeoLong": "63.10122430000001", "GeoLat": "13.796461099999988", "type": "Skidor" },
            { "Id": 3, "PlaceName": "Hannacksjön", "GeoLong": "63.19891579999999", "GeoLat": "15.2974289", "type": "Fiske" },
            { "Id": 4, "PlaceName": "Åre", "GeoLong": "63.3990428", "GeoLat": "13.081505800000059", "type": "Skidor" },
            { "Id": 5, "PlaceName": "Stora rengen", "GeoLong": "58.2589227", "GeoLat": "15.720074699999941", "type": "Fiske" }
        ];

        $.each(data, function (i, item) {
            var icon;
            if (item.type == "Skidor") {
                icon = "/Images/Skiermarker.png"
            }
            else if (item.type == "Fiske") {
                icon = "/Images/Fishmarker.png"
            }
            else if (item.type == "Vandring") {
                icon = "/Images/Hikermarker.png"
            }
            var marker = new google.maps.Marker({
                'position': new google.maps.LatLng(item.GeoLong, item.GeoLat),
                'map': map,
                'animation': google.maps.Animation.DROP,
                'title': item.PlaceName,
                'Type': item.type,
                'icon': icon
            });
            var infowindow = new google.maps.InfoWindow({
                content: "<div class='infoDiv'><h3>" + item.PlaceName + "<br />" + "<br />" + "<h5>" + item.type + "</div>"
            });

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });
        })
    }

    // Hämtar första datan vid inladdning av sida.
    getAllActivities();
    getCategories();
};

ko.applyBindings(new ViewModel());