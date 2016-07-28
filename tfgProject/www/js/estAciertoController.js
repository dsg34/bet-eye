/**
 * Created by i_d_a on 01/07/2016.
 */
angular.module('starter.controllers')

  .controller('EstAciertoCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $state, usSpinnerService) {
    $scope.irA = function(estado){
      $state.transitionTo(estado);
    }

    $scope.$on('$ionicView.enter', function(e) {
      usSpinnerService.stop('spinner');
      if (window.localStorage.getItem('usuario') == null)
        $scope.irA('login');

      $scope.seleccionada = ["pestañaSel", "", ""];
      var url = "http://eyebetapi.herokuapp.com/api/tickets/estadisticasTickets";
      var response = $http.post(url, {email: window.localStorage.getItem('usuario')});
      usSpinnerService.spin('spinner');
      response.success(function(data){
        usSpinnerService.stop('spinner');
        console.log(data);
        if(data.estado==true) {
          $scope.proveedores = data.datos.porProveedor;
          $scope.torneos = data.datos.porTorneo;

          $scope.proveedores.sort(comparePorcentaje);
          $scope.torneos.sort(comparePorcentajeTorneo);

          console.log($scope.proveedores);

          $scope.proveedorActual = $scope.proveedores[0];
          $scope.torneoActual = $scope.torneos[0];

          $scope.totalTickets = data.datos.numTickets;
          $scope.ticketsFallados = data.datos.numTicketsFallados;

          $scope.totalEventos = data.datos.numEventos;
          $scope.eventosFallados = data.datos.eventosFallados;

          $scope.aciertoMedio = data.datos.porcentajeMedioAcierto;

          $scope.infoGeneral = data.datos;

          $scope.cambiarGrafico1();
          $scope.cambiarGrafico2();
        }else{
          swal(
            {
              title: "Aún no hay estadísticas de ningún ticket.",
              text: "Volviendo al menú de inicio...",
              type: 'info',
              timer: 2500,
              showConfirmButton: false
            }, function () {
              swal.close();
              $state.go('app.inicio', {ticketId: data._id});
            }
          );
        }
      });
    });

    $ionicNavBarDelegate.showBackButton(false);

    $scope.inicializaSelect = function(){
      if(!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.opcionSelect = $scope.proveedores[0];
        });
      }else {
        $scope.opcionSelect = $scope.proveedores[0];
      }
    }
    $scope.inicializaSelectTorneo = function(){
      if(!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.torneoSelect = $scope.torneos[0];
        });
      }else {
        $scope.torneoSelect = $scope.torneos[0];
      }
    }

    $scope.opciones = [
      { title: 'Estadísticas económicas', redireccion: 'app.economia' },
      { title: 'Estadísticas de acierto', redireccion: 'app.acierto' }
    ];

    $scope.cambiarPestanya = function(num){
      $scope.seleccionada = ["",""];

      if(!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.seleccionada[num] = "pestañaSel";
        });
      }else{
        $scope.seleccionada[num] = "pestañaSel";
      }

    }

    $scope.cambiarGrafico2 = function(){
      if(document.getElementById("grafica2")!=null && $scope.infoGeneral!=null) {
        var piechart = document.getElementById("grafica2").getContext("2d");
        var myPieChart = new Chart(piechart, {
          type: 'pie',
          data: {
            labels: [
              "Acertados",
              "Fallados",
              "En curso"
            ],
            datasets: [
              {
                data: [$scope.infoGeneral.numTicketsGanados, $scope.infoGeneral.numTicketsFallados, $scope.infoGeneral.numTicketsEnCurso],
                backgroundColor: [
                  "#66e760",
                  "#ed4141",
                  "#DAFF3D"
                ],
                hoverBackgroundColor: [
                  "#9cf198",
                  "#f88181",
                  "#F2FF6E"
                ]
              }]
          },
          options: {
            responsive: true
          }
        });
      }
    }

    $scope.cambiarGrafico1 = function(){
      if(document.getElementById("grafica1")!=null && $scope.infoGeneral!=null) {
        var piechart = document.getElementById("grafica1").getContext("2d");
        var myPieChart = new Chart(piechart, {
          type: 'pie',
          data: {
            labels: [
              "Acertados",
              "Fallados",
              "En curso"
            ],
            datasets: [
              {
                data: [$scope.infoGeneral.eventosAcertados, $scope.infoGeneral.eventosFallados, $scope.infoGeneral.numEventos-$scope.infoGeneral.eventosAcertados-$scope.infoGeneral.eventosFallados],
                backgroundColor: [
                  "#489844",
                  "#954373",
                  "#BC8255"
                ],
                hoverBackgroundColor: [
                  "#74B970",
                  "#B56E98",
                  "#FFDDC2"
                ]
              }]
          },
          options: {
            responsive: true
          }
        });
      }
    }

    $scope.cambiarGrafico3 = function(){
      if(document.getElementById("grafica3")!=null) {
        var piechart = document.getElementById("grafica3").getContext("2d");
        var myPieChart = new Chart(piechart, {
          type: 'pie',
          data: {
            labels: [
              "Acertados",
              "Fallados",
              "En curso"
            ],
            datasets: [
              {
                data: [$scope.proveedorActual.eventosGanados, $scope.proveedorActual.eventosPerdidos, $scope.proveedorActual.eventosEnCurso],
                backgroundColor: [
                  "#489844",
                  "#954373",
                  "#BC8255"
                ],
                hoverBackgroundColor: [
                  "#74B970",
                  "#B56E98",
                  "#FFDDC2"
                ]
              }]
          },
          options: {
            responsive: true
          }
        });
      }
    }

    $scope.cambiarGrafico4 = function(){
      if(document.getElementById("grafica4")!=null) {
        var piechart = document.getElementById("grafica4").getContext("2d");
        var myPieChart = new Chart(piechart, {
          type: 'pie',
          data: {
            labels: [
              "Acertados",
              "Fallados",
              "En curso"
            ],
            datasets: [
              {
                data: [$scope.proveedorActual.ganados, $scope.proveedorActual.perdidos, $scope.proveedorActual.enCurso],
                backgroundColor: [
                  "#66e760",
                  "#ed4141",
                  "#DAFF3D"
                ],
                hoverBackgroundColor: [
                  "#9cf198",
                  "#f88181",
                  "#F2FF6E"
                ]
              }]
          },
          options: {
            responsive: true
          }
        });
      }
    }

    $scope.cambiarGrafico5 = function(){
      if(document.getElementById("grafica5")!=null) {
        var piechart = document.getElementById("grafica5").getContext("2d");
        var myPieChart = new Chart(piechart, {
          type: 'pie',
          data: {
            labels: [
              "Acertados",
              "Fallados",
              "En curso"
            ],
            datasets: [
              {
                data: [$scope.torneoSelect.acertados, $scope.torneoSelect.fallados, $scope.torneoSelect.enCurso],
                backgroundColor: [
                  "#66e760",
                  "#ed4141",
                  "#DAFF3D"
                ],
                hoverBackgroundColor: [
                  "#9cf198",
                  "#f88181",
                  "#F2FF6E"
                ]
              }]
          },
          options: {
            responsive: true
          }
        });
      }
    }

    $scope.cambiarProveedor = function(proveedor){
      if(!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.proveedorActual = proveedor;
          $scope.opcionSelect = proveedor;
          $scope.cambiarGrafico3();
          $scope.cambiarGrafico4();
        });
      }else{
        $scope.proveedorActual = proveedor;
        $scope.opcionSelect = proveedor;
        $scope.cambiarGrafico3();
        $scope.cambiarGrafico4();
      }
    }

    $scope.cambiarTorneo = function(torneo){
      if(!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.torneoActual = torneo;
          $scope.torneoSelect = torneo;
          $scope.cambiarGrafico5();
        });
      }else{
        $scope.torneoActual = torneo;
        $scope.torneoSelect = torneo;
        $scope.cambiarGrafico5();
      }
    }

    $scope.buscarProveedor = function(nombre){
      var myArray = $scope.proveedores;
      for (var i=0; i < myArray.length; i++) {
        if (myArray[i].proveedor === nombre) {
          return myArray[i];
        }
      }
    }

    $scope.compruebaSeleccionado = function(prov){
      if($scope.proveedorActual.proveedor==prov.proveedor){
        return "proveedorSel";
      }else{
        return "";
      }
    }

    $scope.compruebaTorneoSeleccionado = function(prov){
      if($scope.torneoActual.torneo==prov.torneo){
        return "proveedorSel";
      }else{
        return "";
      }
    }

    function comparePorcentaje(a,b) {
      if (a.porcentajeTickets > b.porcentajeTickets)
        return -1;
      else if (a.porcentajeTickets < b.porcentajeTickets)
        return 1;
      else
        return 0;
    }

    function comparePorcentajeTorneo(a,b){
      a.porcentaje = a.acertados/a.eventos;
      b.porcentaje = b.acertados/b.eventos;

      if (a.porcentaje > b.porcentaje)
        return -1;
      else if (a.porcentaje < b.porcentaje)
        return 1;
      else
        return 0;
    }

  });
