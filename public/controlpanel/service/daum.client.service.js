// Invoke 'strict' JavaScript mode
'use strict';

// Create the Socket.io wrapper service
angular.module('controlpanel').service('daum', ['Authentication', '$location', '$timeout',
    function(Authentication, $location, $timeout) {

        if (Authentication.user) {
            this.daum = daum;
        }
        else {
            $location.path('/');
        }


        var container = document.getElementById('map');
        container.style.width = '100%';
        container.style.height = $(window).innerHeight() - 100 + 'px';
        var mapOption = {
            center: new daum.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            level: 5 , // 지도의 확대 레벨
            mapTypeId: daum.maps.MapTypeId.HYBRID
        };
        //var geocoder = new daum.maps.services.Geocoder();
        
        var map = new daum.maps.Map(container, mapOption);
        
        //var geocoder = new daum.maps.services.Geocoder();
        var mapTypeControl = new daum.maps.MapTypeControl();
        map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);;
        var zoomControl = new daum.maps.ZoomControl();
        map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);

        console.log(daum)
        this.LatLng = function(lat, lng) {
            return new daum.maps.LatLng(lat, lng)
        }
        this.setCenter = function(lat, lng) {
            var moveLatLon = new daum.maps.LatLng(lat, lng);
            map.setCenter(moveLatLon);
            console.log("setCenter");
        }
        this.panTo = function(lat, lng) {
            var moveLatLon = new daum.maps.LatLng(lat, lng);
            map.panTo(moveLatLon);
        }
        //event
        this.onClick = function(callback) {
            daum.maps.event.addListener(map, 'click', function(mouseEvent) {
                $timeout(function() {
                    callback(mouseEvent);
                });
            });
        }










    }
]);