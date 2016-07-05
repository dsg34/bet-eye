/**
 * Created by i_d_a on 01/07/2016.
 */
angular.module('starter.controllers')

  .controller('EstAciertoCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $state) {
    $scope.irA = function(estado){
      $state.transitionTo(estado);
    }

    $scope.$on('$ionicView.enter', function(e) {
      if (window.localStorage.getItem('usuario') == null)
        $scope.irA('login');
    });

    $ionicNavBarDelegate.showBackButton(false);

    $scope.seleccionada = ["pestañaSel", "", ""];
    $scope.totalTickets = 7;
    $scope.ticketsFallados = 3;

    $scope.totalEventos = 56;
    $scope.eventosFallados = 17;

    $scope.aciertoMedio = 65;

    $scope.proveedores = [
      {proveedor: "Luckia", ratio: 7.13, invertido: 6.2, ganado: 2.9, porcentaje: 56, tickets: 14, ganados: 8, eventos: 53, acertados: 23},
      {proveedor: "Sportium", ratio: 2.13, invertido: 1.2, ganado: 3, porcentaje: 32, tickets: 14, ganados: 8, eventos: 53, acertados: 23},
      {proveedor: "Bwin", ratio: 4.13, invertido: 2, ganado: 4, porcentaje: 86, tickets: 14, ganados: 8, eventos: 53, acertados: 23},
      {proveedor: "Codere", ratio: 6.13, invertido: 3.20, ganado: 0, porcentaje: 84, tickets: 14, ganados: 8, eventos: 53, acertados: 23},
      {proveedor: "Bet365", ratio: 8.13, invertido: 1.4, ganado: 2.3, porcentaje: 23, tickets: 14, ganados: 8, eventos: 53, acertados: 23},
      {proveedor: "Betclick", ratio: 9.13, invertido: 5.2, ganado: 3.6, porcentaje: 12, tickets: 14, ganados: 8, eventos: 53, acertados: 23},
      {proveedor: "William Hill", ratio: 7.3, invertido: 10, ganado: 8.1, porcentaje: 75, tickets: 14, ganados: 8, eventos: 53, acertados: 23},
      {proveedor: "WannaBet", ratio: 2.13, invertido: 1.3, ganado: 3.2, porcentaje: 91, tickets: 14, ganados: 8, eventos: 53, acertados: 23},
      {proveedor: "Playfulbet", ratio: 1.13, invertido: 4.5, ganado: 5.4, porcentaje: 61, tickets: 14, ganados: 8, eventos: 53, acertados: 23},
    ]

    $scope.torneos = [
      {torneo: "Liga española", eventos: 14, acertados: 8},
      {torneo: "Bundesliga", eventos: 2, acertados: 0},
      {torneo: "Eurocopa", eventos: 8, acertados: 6},
    ]

    $scope.proveedores.sort(comparePorcentaje);
    $scope.torneos.sort(comparePorcentajeTorneo);

    $scope.inicializaSelect = function(){
      if(!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.opcionSelect = $scope.proveedores[0];
          $scope.cambiarGrafico2();
        });
      }else {
        $scope.opcionSelect = $scope.proveedores[0];
        $scope.cambiarGrafico2();
      }
    }
    $scope.inicializaSelectTorneo = function(){
      if(!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.torneoSelect = $scope.torneos[0];
          $scope.cambiarGrafico5();
        });
      }else {
        $scope.torneoSelect = $scope.torneos[0];
        $scope.cambiarGrafico5();
      }
    }

    $scope.proveedorActual = $scope.proveedores[0];
    $scope.torneoActual = $scope.torneos[0];

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

      if(num==0){
        console.log("si");
        $scope.calcularRatio();
      }
    }

    $scope.calcularRatio = function(){
      $scope.ratio = $scope.ganado/$scope.invertido;
    }

    $scope.cambiarGrafico2 = function(){
      console.log("Cambio gráfica 2");
      if(document.getElementById("grafica2")!=null) {
        var piechart = document.getElementById("grafica2").getContext("2d");
        var myPieChart = new Chart(piechart, {
          type: 'pie',
          data: {
            labels: [
              "Acertados",
              "Fallados"
            ],
            datasets: [
              {
                data: [$scope.totalTickets-$scope.ticketsFallados, $scope.ticketsFallados],
                backgroundColor: [
                  "#ed4141",
                  "#66e760"
                ],
                hoverBackgroundColor: [
                  "#f88181",
                  "#9cf198"
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
      if(document.getElementById("grafica1")!=null) {
        var piechart = document.getElementById("grafica1").getContext("2d");
        var myPieChart = new Chart(piechart, {
          type: 'pie',
          data: {
            labels: [
              "Acertados",
              "Fallados"
            ],
            datasets: [
              {
                data: [$scope.totalEventos-$scope.eventosFallados, $scope.eventosFallados],
                backgroundColor: [
                  "#2A30AB",
                  "#F5BD1D"
                ],
                hoverBackgroundColor: [
                  "#7C7CC6",
                  "#F3CE61"
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
              "Fallados"
            ],
            datasets: [
              {
                data: [$scope.proveedorActual.acertados, $scope.proveedorActual.eventos-$scope.proveedorActual.acertados],
                backgroundColor: [
                  "#2A30AB",
                  "#F5BD1D"
                ],
                hoverBackgroundColor: [
                  "#7C7CC6",
                  "#F3CE61"
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
              "Fallados"
            ],
            datasets: [
              {
                data: [$scope.proveedorActual.ganados, $scope.proveedorActual.tickets-$scope.proveedorActual.ganados],
                backgroundColor: [
                  "#ed4141",
                  "#66e760"
                ],
                hoverBackgroundColor: [
                  "#f88181",
                  "#9cf198"
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
              "Fallados",
              "Acertados"
            ],
            datasets: [
              {
                data: [$scope.torneoSelect.eventos-$scope.torneoSelect.acertados, $scope.torneoSelect.acertados],
                backgroundColor: [
                  "#ed4141",
                  "#66e760"
                ],
                hoverBackgroundColor: [
                  "#f88181",
                  "#9cf198"
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
          $scope.cambiarGrafico2();
        });
      }else{
        $scope.proveedorActual = proveedor;
        $scope.opcionSelect = proveedor;
        $scope.cambiarGrafico2();
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
      if (a.porcentaje > b.porcentaje)
        return -1;
      else if (a.porcentaje < b.porcentaje)
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
