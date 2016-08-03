/**
 * Created by i_d_a on 03/06/2016.
 */
angular.module('starter.controllers')

  .controller('InicioCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $state, usSpinnerService) {
    $scope.irA = function(estado){
      $state.transitionTo(estado);
    }

    $scope.paginaInicio = true;

    $scope.$on('$ionicView.enter', function(e) {
      if (window.localStorage.getItem('usuario') == null)
        $scope.irA('login');
      usSpinnerService.stop('spinner');
    });

    $ionicNavBarDelegate.showBackButton(false);

    $scope.opciones = [
      { title: 'Ver tickets', icono: 'file-text-o', redireccion: 'app.tickets' },
      { title: 'Escanear nuevo ticket', icono: 'camera', redireccion: 'app.escanear' },
      { title: 'Crear ticket manual', icono: 'pencil-square-o', redireccion: 'app.insertar' },
      { title: 'Ver estadísticas', icono: 'pie-chart', redireccion: 'app.estadisticas' },
    ];
  });
