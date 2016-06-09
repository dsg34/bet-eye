/**
 * Created by i_d_a on 03/06/2016.
 */
angular.module('starter.controllers')

  .controller('RegistroCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $state) {
    $scope.irA = function(estado){
      $state.go(estado);
    }

    $scope.$on('$ionicView.enter', function(e) {
      if (window.localStorage.getItem('usuario') != null)
        $scope.irA('app.inicio');
    });

    $scope.loginData = {};
    $ionicNavBarDelegate.showBackButton(false);
    // Perform the login action when the user submits the login form
    $scope.registro = function() {
      console.log($scope.loginData);
      if($scope.loginData.email=="" || $scope.loginData.email==null || $scope.loginData.password=="" || $scope.loginData.password==null || $scope.loginData.password2=="" || $scope.loginData.password2==null){
        swal("¡Error!", "Debes rellenar todos los campos", "error");
        console.log()
      }else{
        if($scope.loginData.password != $scope.loginData.password2){
          swal("¡Error!", "Las contraseñas introducidas no coinciden", "error");
        }else{
          if(!validateEmail($scope.loginData.email) || !validateSpamEmail($scope.loginData.email)){
            swal("¡Error!", "Debes introducir un email válido", "error");
          }else {
            var response = $http.post('http://eyebetapi.herokuapp.com/registro', $scope.loginData);
            response.success(function (data) {
              console.log(data);
              if (data.estado == false)
                swal("¡Error!", data.error, "error");
              else {
                window.localStorage.getItem('token', data.token);
                window.localStorage.setItem('usuario', data.email);
                $scope.irA('app.inicio');
              }
            });
          }
        }
      }
    };

    function validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    function validateSpamEmail(email){
      var devuelve = true;
      if(email.indexOf("@trbvn.com"!=-1)){
        devuelve = false;
      }
      return devuelve;
    }

  });
