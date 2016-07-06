/**
 * Created by i_d_a on 03/06/2016.
 */
angular.module('starter.controllers')

  .controller('EditarCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $state, usSpinnerService) {
    $scope.irA = function(estado){
      $state.transitionTo(estado);
    }
    $scope.$on('$ionicView.enter', function(e) {
      usSpinnerService.stop('spinner');
      if (window.localStorage.getItem('usuario') == null)
        $scope.irA('login');
    });

    $ionicNavBarDelegate.showBackButton(false);

    $scope.loginData = {};

    var response = $http.get('http://eyebetapi.herokuapp.com/api/usuarios/usuario/'+window.localStorage.getItem('usuario'));
    usSpinnerService.spin('spinner');
    response.success(function (data) {
      usSpinnerService.stop('spinner');
      $scope.loginData.email = data.email;
      $scope.loginData.password = "";
      $scope.loginData.password2 = "";
    });


    $scope.actualizarInformacion = function(){
      var actualiza = {};
      var enviar = false;
      if($scope.loginData.email!=""){
        actualiza['email'] = $scope.loginData.email;
        enviar=true;
      }

      if($scope.loginData.password!=""){
        actualiza['password'] = $scope.loginData.password;
        enviar=true;
      }

      if(enviar==true){
        actualiza['password2'] = $scope.loginData.password2;
        console.log("s");
        console.log($scope.loginData.password2);
        if($scope.loginData.password2!="" && $scope.loginData.password2!=null){
          usSpinnerService.spin('spinner');
          var response = $http.post('http://eyebetapi.herokuapp.com/api/usuarios/editar/'+window.localStorage.getItem('usuario'), actualiza);
          response.success(function (data) {
            usSpinnerService.stop('spinner');
            if(data.estado==true) {
              swal("¡Hecho!", "Tus datos han sido modificados con éxito.", "success");
              window.localStorage.setItem('usuario', data.email);
              $scope.loginData.email = data.email;
              $scope.loginData.password = "";
              $scope.loginData.password2 = "";
            }else{
              swal("¡Error!", data.error, "error");
            }
          });

        }else{
          swal("¡Error!", "No has introducido tu contraseña actual. Este paso es necesario para garantizar la seguridad.", "error");
        }
      }else{
        swal("¡Error!", "No has rellenado ninguno de los dos campos a actualizar.", "error");
      }
    }



  });
