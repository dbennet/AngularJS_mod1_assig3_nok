(function () {
    "use strict";

    angular.module("NarrowItDownApp", [])
           .controller("NarrowItDownController", NarrowItDownController)
           .service("MenuSearchService", MenuSearchService)
           .directive("foundItems", FoundItems);

    NarrowItDownController.$inject = ["MenuSearchService"];
    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;

        ctrl.getMatchedMenuItems = function () {
            var searchTerm = ctrl.searchTerm;
            var promise;

            // ensure search term is not empty
            if (searchTerm === undefined || searchTerm.trim() === "") {
                ctrl.found = [];
                return;
            }

          
            // use service to get menu items. 
            promise = MenuSearchService.getMatchedMenuItems(searchTerm);
            promise.then(function (response) {
                ctrl.found = response;
            })
            .catch(function (error) {
                console.log("Something went wrong:", error);
            });
        };

        ctrl.removeItem = function (index) {
            MenuSearchService.removeItem(index);
        };
    }
    
    function FoundItems () {
        // declare the ddo for foundItems.html
        var ddo = {
            templateUrl: "foundItems.html",
            restrict: "E",
            scope: {
                foundItems: "<",
                onRemove: "&"
            },
            // controller: FoundItemsDirectiveController,
            // bindToController: true,
            // controllerAs: "ctrller"
        };

        return ddo;
    }

    function FoundItemsDirectiveController () {}


    MenuSearchService.$inject = ["$http"];
    function MenuSearchService($http) {
        var service = this;
        var foundItems;    

        // declare the service for returning the http response
        service.getMatchedMenuItems = function (searchTerm) {

            return $http({
                method: "GET",
                url: "https://davids-restaurant.herokuapp.com/menu_items.json"
            }).then(function (result) {

                // process result and only keep items that match
                var allItems = result.data.menu_items;
                foundItems = [];

                for (var i = 0, length = allItems.length; i < length; i++ ) {
                    if (allItems[i].name.toLowerCase().indexOf(searchTerm) !== -1) {
                        foundItems.push(allItems[i]);
                    }
                }

                // return processed items
                return foundItems;
            });
        };

        // this is remove an item from the list
        service.removeItem = function (itemIndex) {
            foundItems.splice(itemIndex, 1);
        };
    }

})();