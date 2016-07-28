/**
 * Created by i_d_a on 06/07/2016.
 */
angular.module('starter.controllers')

  .controller('CrearTicketCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $state, usSpinnerService) {
    $scope.irA = function (estado) {
      $state.transitionTo(estado);
    }
    $scope.$on('$ionicView.enter', function (e) {
      usSpinnerService.stop('spinner');
      if (window.localStorage.getItem('usuario') == null)
        $scope.irA('login');

      $scope.mostrarPopup = false;

      $scope.eventos = [];

      $scope.evento = {
        equipo1: "",
        equipo2: "",
        tipo: "",
        resultado: "",
        cuota: ""
      }
    });

    $scope.guardarEvento = function(){
      if($scope.evento.equipo1!="" && $scope.evento.equipo2!="" && $scope.evento.resultado!=""){
        $scope.ticket = {};

        $scope.evento.equipo1 = eliminarEspacios($scope.evento.equipo1).toUpperCase();
        $scope.evento.equipo2 = eliminarEspacios($scope.evento.equipo2).toUpperCase();

        if($scope.evento.cuota=="" || $scope.evento.cuota==null)
          delete $scope.evento.cuota;

        if($scope.evento.tipo=="" || $scope.evento.tipo==null)
          delete $scope.evento.tipo;

        $scope.eventos.push($scope.evento);

        $scope.evento = {
          equipo1: "",
          equipo2: "",
          tipo: "",
          resultado: "",
          cuota: ""
        }
      }else{
        swal("¡Datos incompletos!", "Debes rellenar, al menos, los datos: equipo1, equipo2 y resultado", 'error');
      }
    }

    $scope.eliminarEvento = function(indice){
      $scope.eventos.splice(indice, 1);
    }

    var automatico=false;
    var cuotaPorEuro=0;

    $scope.siguiente = function(){
      if($scope.eventos.length>0) {
        $scope.mostrarPopup = true;
        var premio = 0;
        for(var t=0; t<$scope.eventos.length; t++){
          if(premio!=-1 && $scope.eventos[t].cuota!=null)
            premio += $scope.eventos[t].cuota;
          else
            premio=-1;
        }
        if(premio!=-1) {
          $scope.importeTicket = 1;
          $scope.premioTicket = premio;
          automatico=true;
          cuotaPorEuro=premio;
        }
      }else{
        swal("¡Ups!", "No has añadido ningún evento al ticket.", "warning")
      }
    }

    $scope.cambiarPremio = function(importe){
      if(automatico == true && importe!=""){
        $scope.premioTicket = importe*cuotaPorEuro;
      }
    }

    $scope.eliminarAutomatico = function(){
      automatico=false;
    }

    $scope.guardarTicket = function(nombre, proveedor, importe, premio){
      if(proveedor!=null && proveedor!="" && importe!=null && importe!="" && premio!=null && premio!=""){
        if(nombre!="" && nombre!=null){
          $scope.ticket.nombre = nombre;
        }else{
          $scope.ticket.nombre = $scope.devuelveFecha();
        }

        if(proveedor!="" && proveedor!=null){
          $scope.ticket.proveedor = removeDiacritics(proveedor.toUpperCase());
        }else{
          $scope.ticket.proveedor = "SIN PROVEEDOR";
        }

        $scope.ticket.premio = premio;
        $scope.ticket.importe = importe;
        $scope.ticket.eventos = $scope.eventos;

        $scope.ticket.usuario = window.localStorage.getItem('usuario');

        var response = $http.post('http://eyebetapi.herokuapp.com/api/tickets/', $scope.ticket);
        usSpinnerService.spin('spinner');
        response.success(function (data) {
          usSpinnerService.stop('spinner');
          swal(
            {
              title: "¡Ticket guardado!",
              text: "Su ticket ha sido almacenado correctamente.",
              type: 'success',
              timer: 2500,
              showConfirmButton: false
            }, function(){
              swal.close();
              $state.go('app.detalleTicket', {ticketId: data._id});
            }
          );
        });

      }else{
        swal("¡Ups!", "Completa todos los datos.", "warning")
      }
    }

    $scope.volverATicket = function(){
      $scope.mostrarPopup = false;
    }

    $scope.devuelveFecha = function(){
      var fecha = new Date();
      var dia = fecha.getDate().toString()
      var mes = (fecha.getMonth()+1).toString();
      if(mes.length==1){
        mes = "0"+mes;
      }
      var anyo = fecha.getFullYear().toString();

      var hora = fecha.getHours().toString();
      if(hora.length==1){
        hora = "0"+hora;
      }

      var minutos = fecha.getMinutes().toString();
      if(minutos.length==1){
        minutos="0+minutos";
      }

      var textoFecha = dia + "/" + mes + "/" + anyo+" "+hora+":"+minutos;
      return textoFecha;
    }

    function eliminarEspacios(palabra){
      console.log(palabra);
      if(palabra!=null){
        while(palabra.length>0 && palabra[0]==' '){
          palabra = palabra.slice(1,palabra.length);
        }

        while(palabra.length>0 && palabra[palabra.length-1]==' '){
          palabra = palabra.slice(0, palabra.length-1);
        }
      }
      return palabra;
    }

    $ionicNavBarDelegate.showBackButton(false);
  });
