/**
 * Created by i_d_a on 03/06/2016.
 */
angular.module('starter.controllers')

  .controller('VerTicketsCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $state, usSpinnerService) {
    $scope.irA = function(estado){
      $state.transitionTo(estado);
    }

    $scope.$on('$ionicView.enter', function(e) {
      if (window.localStorage.getItem('usuario') == null)
        $scope.irA('login');
      else{
        usSpinnerService.spin('spinner');
        var response = $http.post('http://eyebetapi.herokuapp.com/api/tickets/filtrarPorUsuario', {usuario: window.localStorage.getItem('usuario')});
        response.success(function (data) {
          usSpinnerService.stop('spinner');
          $scope.tickets = data.tickets;
        });
      }
    });

    $scope.formatearFecha = function(fecha){
      var date = new Date(fecha);
      var string = "";
      string += date.getDate().toLocaleString()+"/"+(date.getMonth()+1).toLocaleString()+"/"+date.getFullYear();
      return string;
    }

    $scope.irADetalle = function(id){
      $state.go('app.detalleTicket', {ticketId: id});
    }

    $ionicNavBarDelegate.showBackButton(false);
  });
