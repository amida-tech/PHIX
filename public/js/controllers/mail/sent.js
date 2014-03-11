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

angular.module('phix.sentCtrl', ['bt.forms', 'phix.utilityService', 'phix.authenticationService']).controller('SentCtrl', ['$scope',
  '$q',
  '$http',
  '$rootScope',
  '$location',
  'UtilityService',
  'MailService',
  'AuthenticationService',
  function($scope, $q, $http, $rootScope, $location, utils, mailService, AuthenticationService) {

    mailService.initializeMailbox
      .then(function() {
        return mailService.getMailbox('/direct/outbox');
      })
      .then(function(messages) {
        return mailService.process(messages, 'sent');
      })
      .then(function(sentMessages) {
        $scope.sentMessages = sentMessages;
        console.log($scope.sentMessages);
      });

    // Events coming from the base mail service.
    $scope.$on('sent:toggleSelectAll', function(selectedState) {
      $('ul li').each(function() {
        $scope.toggleSelectedState(this, selectedState);
      });
    });

    // Abstract to global
    $scope.toggleSelectedState = function(el, state) {
      $(el).find('input[type="checkbox"]').click();
      $(el).toggleClass('hover');
      $(el).find('.unread').removeClass('unread');
    };

  }
]);