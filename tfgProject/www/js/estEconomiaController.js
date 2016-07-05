/**
 * Created by i_d_a on 01/07/2016.
 */
angular.module('starter.controllers')

  .controller('EstEconomiaCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $state) {
    $scope.irA = function(estado){
      $state.transitionTo(estado);
    }

    $scope.$on('$ionicView.enter', function(e) {
      if (window.localStorage.getItem('usuario') == null)
        $scope.irA('login');
    });

    $ionicNavBarDelegate.showBackButton(false);

    $scope.seleccionada = ["pestañaSel",""];
    $scope.invertido = 36.50;
    $scope.ganado = 49.53;

    $scope.proveedores = [
      {proveedor: "Luckia", ratio: 7.13, invertido: 6.2, ganado: 2.9},
      {proveedor: "Sportium", ratio: 2.13, invertido: 1.2, ganado: 3},
      {proveedor: "Bwin", ratio: 4.13, invertido: 2, ganado: 4},
      {proveedor: "Codere", ratio: 6.13, invertido: 3.20, ganado: 0},
      {proveedor: "Bet365", ratio: 8.13, invertido: 1.4, ganado: 2.3},
      {proveedor: "Betclick", ratio: 9.13, invertido: 5.2, ganado: 3.6},
      {proveedor: "William Hill", ratio: 7.3, invertido: 10, ganado: 8.1},
      {proveedor: "WannaBet", ratio: 2.13, invertido: 1.3, ganado: 3.2},
      {proveedor: "Playfulbet", ratio: 1.13, invertido: 4.5, ganado: 5.4},
    ]

    $scope.proveedores.sort(compareRatio);

    function compareRatio(a,b) {
      if (a.ratio > b.ratio)
        return -1;
      else if (a.ratio < b.ratio)
        return 1;
      else
        return 0;
    }

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

    $scope.proveedorActual = $scope.proveedores[0];

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

    $scope.cambiarGrafico = function(){
      if(document.getElementById("myChart")!=null) {
        var piechart = document.getElementById("myChart").getContext("2d");
        var myPieChart = new Chart(piechart, {
          type: 'pie',
          data: {
            labels: [
              "Dinero invertido",
              "Dinero ganado"
            ],
            datasets: [
              {
                data: [$scope.invertido, $scope.ganado],
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
          $scope.cambiarGrafico2();
          $scope.opcionSelect = proveedor;
        });
      }else{
        $scope.proveedorActual = proveedor;
        $scope.cambiarGrafico2();
        $scope.opcionSelect = proveedor;
      }
      console.log($scope.opcionSelect);
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

    $scope.cambiarGrafico2 = function(){
      if(document.getElementById("myChart2")!=null) {
        var piechart = document.getElementById("myChart2").getContext("2d");
        var myPieChart = new Chart(piechart, {
          type: 'pie',
          data: {
            labels: [
              "Dinero invertido",
              "Dinero ganado"
            ],
            datasets: [
              {
                data: [$scope.proveedorActual.invertido, $scope.proveedorActual.ganado],
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

  });
