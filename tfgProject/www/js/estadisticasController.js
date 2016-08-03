/**
 * Created by i_d_a on 03/06/2016.
 */
angular.module('starter.controllers')

  .controller('EstadisticasCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $state, usSpinnerService) {
    $scope.irA = function(estado){
      usSpinnerService.stop('spinner');
      $state.transitionTo(estado);
    }

    $scope.$on('$ionicView.enter', function(e) {
      if (window.localStorage.getItem('usuario') == null)
        $scope.irA('login');
    });

    $ionicNavBarDelegate.showBackButton(false);

    console.log("eeeh");

    $scope.opciones = [
      { title: 'Estadísticas económicas', redireccion: 'app.economia', icono: 'eur'},
      { title: 'Estadísticas de acierto', redireccion: 'app.acierto', icono: 'percent' }
    ];
  });
