/**
 * Created by Khang on 5/19/2015.
 */
var scalableCrud = angular.module('scalableCrud', ['ngResource'])
scalableCrud.controller('MainController', function($scope, $resource) {
        var accounts = $resource('./accounts/:id');

        accounts.get({ id: 1 }, function(d) {
            $scope.test = d;
        }); // get() returns a single entry

        accounts.query(function(d){
           $scope.all =  d;
        });
});