/**
 * Created by i_d_a on 03/06/2016.
 */
angular.module('starter.controllers')

  .controller('InicioCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $state) {
    $scope.irA = function(estado){
      $state.transitionTo(estado);
    }

    $scope.$on('$ionicView.enter', function(e) {
      if (window.localStorage.getItem('usuario') == null)
        $scope.irA('login');
    });

    $ionicNavBarDelegate.showBackButton(false);


    $scope.opciones = [
      { title: 'Ver tickets', redireccion: 'app.tickets' },
      { title: 'Escanear nuevo ticket', redireccion: 'app.escanear' },
      { title: 'Ver estadísticas', redireccion: 'app.estadisticas' },
    ];
  });
