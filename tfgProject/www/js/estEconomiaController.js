/**
 * Created by i_d_a on 01/07/2016.
 */
angular.module('starter.controllers')

  .controller('EstEconomiaCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $state, usSpinnerService) {
    $scope.irA = function(estado){
      $state.transitionTo(estado);
    }

    $scope.$on('$ionicView.enter', function(e) {
      usSpinnerService.stop('spinner');
      if (window.localStorage.getItem('usuario') == null)
        $scope.irA('login');

      $scope.seleccionada = ["pestañaSel",""];

      var url = "http://eyebetapi.herokuapp.com/api/tickets/estadisticasTickets";
      var response = $http.post(url, {email: window.localStorage.getItem('usuario')});
      usSpinnerService.spin('spinner');
      response.success(function(data){
        usSpinnerService.stop('spinner');
        console.log(data);
        $scope.invertido = data.datos.totalGastado;
        $scope.ganado = data.datos.totalGanado;
        $scope.enJuego = data.datos.dineroEnJuego;
        $scope.ratio = data.datos.ratio;

        $scope.proveedores = data.datos.porProveedor;
        $scope.proveedores.sort(compareRatio);

        $scope.proveedorActual = $scope.proveedores[0];

        $scope.cambiarGrafico();
        $scope.cambiarGrafico2();
      });

    });

    $ionicNavBarDelegate.showBackButton(false);

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

    $scope.cambiarGrafico = function(){
      console.log("Hola");
      console.log(document.getElementById("myChart"));
      console.log($scope.invertido + " / " + $scope.ganado + " / " + $scope.enJuego);
      if(document.getElementById("myChart")!=null && $scope.invertido!=null && $scope.ganado!=null && $scope.enJuego!=null) {
        console.log("Adios");
        var piechart = document.getElementById("myChart").getContext("2d");
        var myPieChart = new Chart(piechart, {
          type: 'pie',
          data: {
            labels: [
              "Dinero invertido",
              "Dinero ganado",
              "Dinero en juego"
            ],
            datasets: [
              {
                data: [$scope.invertido, $scope.ganado, $scope.enJuego],
                backgroundColor: [
                  "#ed4141",
                  "#66e760",
                  "#DAFF3D"
                ],
                hoverBackgroundColor: [
                  "#f88181",
                  "#9cf198",
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
      if($scope.proveedorActual!=null) {
        if ($scope.proveedorActual.proveedor == prov.proveedor) {
          return "proveedorSel";
        } else {
          return "";
        }
      }else{
        return "";
      }
    }

    $scope.cambiarGrafico2 = function(){
      if(document.getElementById("myChart2")!=null && $scope.proveedorActual!=null) {
        var piechart = document.getElementById("myChart2").getContext("2d");
        var myPieChart = new Chart(piechart, {
          type: 'pie',
          data: {
            labels: [
              "Dinero invertido",
              "Dinero ganado",
              "Dinero en juego"
            ],
            datasets: [
              {
                data: [$scope.proveedorActual.totalGastado, $scope.proveedorActual.totalGanado, $scope.proveedorActual.dineroEnJuego],
                backgroundColor: [
                  "#ed4141",
                  "#66e760",
                  "#DAFF3D"
                ],
                hoverBackgroundColor: [
                  "#f88181",
                  "#9cf198",
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

  });
