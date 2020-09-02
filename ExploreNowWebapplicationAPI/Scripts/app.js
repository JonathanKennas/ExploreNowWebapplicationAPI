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

    // Hämtar första datan vid inladdning av sida.
    getAllActivities();
    getCategories();
};

ko.applyBindings(new ViewModel());