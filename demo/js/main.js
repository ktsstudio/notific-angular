'use strict';

angular
    .module('demoApp', [
        'notific'
    ])
    .controller('MainCtrl', function($scope, $rootScope, notific) {
        //notific.config({bootstrap: true});

        $scope.notify = function(type){
            notific.show({
                type: type,
                text: 'тест'
            });
        };
    });
