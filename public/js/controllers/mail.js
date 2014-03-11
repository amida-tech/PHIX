/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

angular.module('phix.mailCtrl', ['bt.forms', 'phix.mailService', 'phix.authenticationService']).controller('MailCtrl',
  [ '$scope',
    '$q',
    '$http',
    '$rootScope',
    '$location',
    'MailService',
    'AuthenticationService',
  function ($scope, $q, $http, $rootScope, $location, utils, mail, dispatcher, auth) {

    // Cache all queries
    $scope.dom = {
      $selectAll: $('#select-all'),
      currentChildView: $('.mail').find('ul').data('view')
    };

    // Methods on the global action bar
    $scope.archiveSelected = function () {
      // Keep it simple and call rootscope here.
      // Could also do:
      // scope.broadcast then in child do scope.parentScope.on('');
      // That would be ideal over binding to the rootScope.
      $rootScope.broadcast($scope.dom.currentChildView + ':archiveSelected');
    };

    $scope.archiveAll = function () {
      $rootScope.broadcast($scope.dom.currentChildView + ':archiveAll');
    };

    $scope.toggleSelectAll = function () {
      currentStatus   = $scope.dom.$selectAll.attr('ng-selected') === 'true' ? true : false;
      invertedStatus  = !currentStatus;

      $scope.dom.$selectAll.attr('ng-selected', invertedStatus);

      // Find the current child view.
      $scope.currentChildView = $('.mail').find('ul').data('view');
      mail.toggleSelectAll($scope.currentChildView, invertedStatus);

      if (invertedStatus) {
        $scope.dom.$selectAll.text('De-select All');
      } else {
        $scope.dom.$selectAll.text('Select All');
      }
    };

}]);
