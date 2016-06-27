/**
 * Created by i_d_a on 03/06/2016.
 */
angular.module('starter.controllers')

  .controller('TicketCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $state, $stateParams, usSpinnerService) {
    $scope.irA = function(estado){
      $state.transitionTo(estado);
    }

    $scope.$on('$ionicView.enter', function(e) {
      if (window.localStorage.getItem('usuario') == null)
        $scope.irA('login');
      else{
        $scope.mostrarPopup = false;
        $scope.mostrarPopup2 = false;
        usSpinnerService.spin('spinner');
        var response = $http.get('http://eyebetapi.herokuapp.com/api/tickets/'+$stateParams.ticketId);
        response.success(function (data) {
          $scope.datosTicket = data;
          $scope.cargarResultados();

        });
      }
    });

    $scope.cargarResultados = function(){
      for(var i=0; i<$scope.datosTicket.eventos.length; i++){
        $scope.almacenarResultado(i);
      }
    }

    $scope.almacenarResultado = function(indice){
      var url = 'http://eyebetapi.herokuapp.com/api/tickets/directo/resultado';
      var response = $http.post(url, {equipo1: $scope.datosTicket.eventos[indice].equipo1, equipo2: $scope.datosTicket.eventos[indice].equipo2});
      response.success(function(data){
        if(data.estado!=false){
          $scope.datosTicket.eventos[indice].estadoPartido = data.datos;
        }else{
          $scope.datosTicket.eventos[indice].errorEstado = data.error;
        }
        if(indice==$scope.datosTicket.eventos.length-1)
          usSpinnerService.stop('spinner');
      });
    }

    $scope.cambiarAEventos = function(){
      $scope.mostrarPopup2 = true;
      $scope.mostrarPopup = false;
    }

    $scope.cambiarAEstadisticas = function(){
      $scope.mostrarPopup = true;
      $scope.mostrarPopup2 = false;
    }

    $scope.mostrarEstadisticas = function(masInfo){
      var url = 'http://eyebetapi.herokuapp.com/api/tickets/directo/analisisPartido';
      var response = $http.post(url, {url: masInfo});
      usSpinnerService.spin('spinner');
      response.success(function (data) {
        usSpinnerService.stop('spinner');
        console.log(data);
        $scope.mostrarPopup = true;
      });
    }

    $scope.cerrarPopup = function(){
      $scope.mostrarPopup = false;
      $scope.mostrarPopup2 = false;
    }

    $scope.mostrarError = function(err){
      swal("Error", err, "error");
    }

    $ionicNavBarDelegate.showBackButton(false);
  });
