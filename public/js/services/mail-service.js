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

angular.module('phix.mailService', [])
  .factory('MailService',
  [ '$rootScope',
    '$http',
    '$q',
  function ($rootScope, $http, $q) {

    // ---------------------------------------------- //
              // INITIALIZING MAILBOXES //
    // ---------------------------------------------- //
    initializeMailbox = function () {
      var init = $q.defer();
      init.resolve();

      return init.promise;
    };

    getMailbox = function (url) {
      var mailbox = $q.defer();
      $http.get(url)
        .success(function (data) {
          if (angular.isArray(data.messages)) {
            mailbox.resolve(data.messages);
          }
        }).error(function (err) {
          mailbox.reject(err);
        });
        return mailbox.promise;
    };

    // This method can process any type of message coming in.
    processMessages = function (messages, type) {
      var process = $q.defer(),
          i = 0, message, inboxMessages = [],
          sentMessages = [], archivedMessages = [];

      for ( ; i < messages.length; i += 1 ) {
        message           = messages[i];
        message.selected  = false;

        // Begin sorting
        // TODO: Refactor
        if (!(message['archived'])) {
          message['archived'] = false;
        } else {
          archivedMessages.push(message);
        }
        if (type === 'sent') {
          sentMessages.push(message);
        }
        if (type === 'inbox') {
          inboxMessages.push(message);
        }

        // We need a utility that says 'yesterday' for
        // new Date(message.received) < new Date(Date.now()) ? console.log('old') : console.log('hi');
        // Add any other processing that needs to happen here.
      }

      if (type === 'inbox')    {process.resolve(inboxMessages);}
      if (type === 'sent')     {process.resolve(sentMessages);}
      if (type === 'archived') {process.resolve(archivedMessages);}

      return process.promise;
    };

    // Initialize the inbox, and bind to a promise.
    promise = initializeMailbox();

    archiveMessage = function (message) {
      $http.put('/mail/messages/' + message.id)
        .data({ archive: true })
        .success(function (res) {
          console.log(res);
        }).error(function (res) {
          console.log(res);
        });
    };

    // ---------------------------------------------- //
          // COMMON METHODS FOR ALL MAILBOXES //
    // ---------------------------------------------- //
    selectMessage = function (message) {
      message.selected = !message.selected;
    };

    // ---------------------------------------------- //
          // COMMON EVENTS FOR ALL MAILBOXES //
    // ---------------------------------------------- //
    archiveSelected = function (view) {
      $rootScope.$broadcast(view + ':archiveSelected');
    };

    toggleSelectAll = function (view, selected) {
      $rootScope.$broadcast(view + ':toggleSelectAll', selected);
    };


    // ---------------------------------------------- //
              // DEFINE METHOD POINTERS //
    // ---------------------------------------------- //
    return {
      process           : processMessages,
      getMailbox        : getMailbox,
      selectMessage     : selectMessage,
      archiveSelected   : archiveSelected,
      archiveMessage    : archiveMessage,
      toggleSelectAll   : toggleSelectAll,
      initializeMailbox : promise
    };


  }]);