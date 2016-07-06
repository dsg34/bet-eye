/**
 * Created by i_d_a on 03/06/2016.
 */
angular.module('starter.controllers')

  .controller('TicketCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $state, $stateParams, usSpinnerService) {
    $scope.irA = function(estado){
      $state.transitionTo(estado);
    }

    $scope.$on('$ionicView.enter', function(e) {
      usSpinnerService.stop('spinner');
      if (window.localStorage.getItem('usuario') == null)
        $scope.irA('login');
      else{
        $scope.mostrarPopup = false;
        $scope.mostrarPopup2 = false;

        $scope.datosPartido = [];
        $scope.estadisticas=[];
        $scope.eventos=[];

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
        $scope.datosTicket.eventos[i].indice = i;
        if($scope.datosTicket.eventos[i].estadoPartido==null)
          $scope.almacenarResultado(i);
        else
          usSpinnerService.stop('spinner');
      }
    }

    $scope.almacenarResultado = function(indice){
      var url = 'http://eyebetapi.herokuapp.com/api/tickets/directo/resultado';
      var response = $http.post(url, {equipo1: $scope.datosTicket.eventos[indice].equipo1, equipo2: $scope.datosTicket.eventos[indice].equipo2});
      response.success(function(data){
        if(data.estado!=false){

          $scope.datosTicket.eventos[indice].estadoPartido = data.datos;
          console.log($scope.datosTicket.eventos[indice]);

          //Si el partido ya ha finalizado, almacenamos su estado para que no se realicen tantas llamadas
          if($scope.datosTicket.eventos[indice].estadoPartido.minutoPartido=="Finalizado"){
            $scope.getEstadisticas(indice);
          }

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


    $scope.getEstadisticas = function(indice){
      var masInfo = $scope.datosTicket.eventos[indice].estadoPartido.masInfo;
      if(masInfo.indexOf('http://www.resultados-futbol.com/')==-1){
        masInfo = 'http://www.resultados-futbol.com/'+masInfo;
      }
      var url = 'http://eyebetapi.herokuapp.com/api/tickets/directo/analisisPartido';
      var response = $http.post(url, {url: masInfo});
      response.success(function (data) {
        if(data.estado)
          $scope.datosTicket.eventos[indice].estadoPartido.datosPartido = data.datos;
        var url = "http://eyebetapi.herokuapp.com/api/tickets/cambiarEstadoEvento";
        console.log($scope.datosTicket.eventos[indice].estadoPartido);
        var responseCambiarEstado = $http.post(url, {id: $stateParams.ticketId, indice: indice, estadoPartido: $scope.datosTicket.eventos[indice].estadoPartido});
        usSpinnerService.spin('spinner');
        responseCambiarEstado.success(function(data){
          console.log("Realizado");
          console.log(data);
          usSpinnerService.stop('spinner');
        });
      });
    }

    $scope.mostrarEstadisticas = function(masInfo, indice){
      console.log(indice);
      console.log($scope.datosTicket.eventos[indice].estadoPartido.datosPartido);
      if($scope.datosTicket.eventos[indice].estadoPartido.datosPartido==null) {
        if (masInfo.indexOf('http://www.resultados-futbol.com/') == -1) {
          masInfo = 'http://www.resultados-futbol.com/' + masInfo;
        }
        var url = 'http://eyebetapi.herokuapp.com/api/tickets/directo/analisisPartido';
        var response = $http.post(url, {url: masInfo});
        usSpinnerService.spin('spinner');
        response.success(function (data) {
          usSpinnerService.stop('spinner');
          console.log(data);
          if (data.estado == true) {
            $scope.datosPartido = data.datos;
            $scope.mostrarPopup = true;
          } else {
            swal('¡Error!', data.error, 'error');
          }
        });
      }else{
        $scope.datosPartido = $scope.datosTicket.eventos[indice].estadoPartido.datosPartido;
        $scope.mostrarPopup = true;
      }
    }

    $scope.cerrarPopup = function(){
      $scope.mostrarPopup = false;
      $scope.mostrarPopup2 = false;
    }

    $scope.mostrarError = function(err){
      swal("Error", err, "error");
    }

    $scope.comprobarEstado = function(num, est){
      var devuelve = "";
      switch(num){
        case -1: if(num==est || est==null) devuelve="encursoSel"; break;
        case 0: if(num==est) devuelve="falladoSel";break;
        case 1: if(num==est) devuelve="acertadoSel";break;
      }
      return devuelve;
    }

    $scope.cambiarEstado = function(estado, indice){
      $scope.datosTicket.eventos[indice].estadoEvento = estado;
      var url = "http://eyebetapi.herokuapp.com/api/tickets/cambiarAcertadoEvento";
      var responseCambiarEstado = $http.post(url, {id: $stateParams.ticketId, indice: indice, estadoEvento: estado});
      usSpinnerService.spin('spinner');
      responseCambiarEstado.success(function(data){
        usSpinnerService.stop('spinner');
      });
    }

    $ionicNavBarDelegate.showBackButton(false);
  });
