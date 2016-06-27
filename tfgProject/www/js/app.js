// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCookies', 'ngCordova', 'angularSpinner'])

  .run(function($ionicPlatform, $http, $cookies) {
    if($cookies.get('tokenAPI')!=null && $cookies.get('tokenAPI')!="")
      $http.defaults.headers.common.Authorization = 'Bearer '+$cookies.get('tokenAPI');

    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        controller: 'AppCtrl',
        templateUrl: 'templates/menu.html',
      })

      .state('login',{
          url: '/login',
          templateUrl: 'templates/login.html',
          controller: 'AppCtrl',
          controllerAs: 'vm'
        }
      )

      .state('registro',{
          url: '/registro',
          templateUrl: 'templates/registro.html',
          controller: 'RegistroCtrl',
          controllerAs: 'vm'
        }
      )

      .state('app.estadisticas', {
        url: '/estadisticas',
        views: {
          'menuContent': {
            templateUrl: 'templates/estadisticas.html'
          }
        }
      })

      .state('app.editar', {
        url: '/editarPerfil',
        views: {
          'menuContent': {
            templateUrl: 'templates/editar.html',
            controller: 'EditarCtrl'
          }
        }
      })
      .state('app.inicio', {
        url: '/inicio',
        views: {
          'menuContent': {
            templateUrl: 'templates/inicio.html',
            controller: 'InicioCtrl'
          }
        }
      })

      .state('app.tickets', {
        url: '/tickets',
        views: {
          'menuContent': {
            templateUrl: 'templates/verTickets.html',
            controller: 'VerTicketsCtrl'
          }
        }
      })

      .state('app.detalleTicket', {
        url: '/tickets/:ticketId',
        views: {
          'menuContent': {
            templateUrl: 'templates/detalleTicket.html',
            controller: 'TicketCtrl'
          }
        }
      })

      .state('app.escanear', {
        url: '/escanear',
        views: {
          'menuContent': {
            templateUrl: 'templates/escanear.html',
            controller: 'OcrCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  });
