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
          console.log(window.localStorage.getItem('usuario'));
          usSpinnerService.stop('spinner');
          $scope.tickets = data.tickets;
          if($scope.tickets.length==0){
            swal(
              {
                title: "Aún no has almacenado ningún ticket.",
                text: "Volviendo al menú de inicio...",
                type: 'info',
                timer: 2500,
                showConfirmButton: false
              }, function () {
                swal.close();
                $state.go('app.inicio', {ticketId: data._id});
              }
            );
          }else{
            for(var i=0; i<$scope.tickets.length; i++){
              $scope.comprobarEstadoTicket(i);
            }
          }
        });
      }
    });

    $scope.comprobarEstadoTicket = function(indice){
      var eventos = $scope.tickets[indice].eventos;
      var estadoTicket=1;
      for(var j=0; j<eventos.length; j++){
        if(eventos[j].estadoEvento==0){
          estadoTicket=0;
        }else if(estadoTicket!=0 && eventos[j].estadoEvento==-1){
          estadoTicket=-1;
        }
      }
      $scope.tickets[indice].estadoTicket = estadoTicket;
    }

    var irATicket = true;
    $scope.eliminarTicket = function(ticket){

      swal({
        title: "Eliminar ticket",
        text: "¿Estás seguro de que deseas eliminar el ticket "+ ticket.nombre +"?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
      }, function(){
        usSpinnerService.spin('spinner');
        var response = $http.delete('http://eyebetapi.herokuapp.com/api/tickets/'+ticket._id);
        response.success(function (data) {
          usSpinnerService.stop('spinner');
          if(data.estado) {
            swal(
              {
                title: "¡Hecho!",
                text: "El ticket ha sido eliminado.",
                type: 'success',
                timer: 2500,
                showConfirmButton: false
              }, function () {
                swal.close();
                $state.go($state.current, {}, {reload: true});
              }
            );
          }
          else
            swal("¡Error!", data.error, "error");
        })
      });

      irATicket = false;
    }

    $scope.formatearFecha = function(fecha){
      var date = new Date(fecha);
      var string = "";
      string += date.getDate().toLocaleString()+"/"+(date.getMonth()+1).toLocaleString()+"/"+date.getFullYear();
      return string;
    }

    $scope.irADetalle = function(id){
      if(irATicket)
        $state.go('app.detalleTicket', {ticketId: id});
      else
        irATicket=true;
    }

    $ionicNavBarDelegate.showBackButton(false);
  });
