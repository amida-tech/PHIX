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

angular.module('phix.archivedCtrl', ['bt.forms', 'phix.utilityService', 'phix.authenticationService']).controller('ArchivedCtrl',
  [ '$scope',
    '$q',
    '$http',
    '$rootScope',
    '$location',
    'UtilityService',
    'MailService',
    'AuthenticationService',
  function ($scope, $q, $http, $rootScope, $location, utils, mailService, AuthenticationService) {

    // Initialize the inbox service and call the method to grab the inbox from it.
    mailService.initializeMailbox
      .then(function ()               { return mailService.getMailbox('/direct/inbox'); })
      .then(function (messages)       { return mailService.process(messages, 'archived'); })
      .then(function (archivedMessages)  {
        $scope.archivedMessages = archivedMessages;
        console.log($scope.archivedMessages);
      });

}]);
