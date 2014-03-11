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

angular.module('phix.utilityService', []).factory('UtilityService', 
  [ '$http',
  function ($http) {
    
    var extend = function (obj1, obj2) {
      for (var i in obj2) {
        if (!obj1.hasOwnProperty(i)) {
           obj1[i] = obj2[i]; 
        }
      }
    };
    
    return {
      extend: extend
    };
  
  }
]);