/**
 * Created by i_d_a on 03/06/2016.
 */
angular.module('starter.controllers')

  .controller('RegistroCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $state, usSpinnerService) {
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
      if($scope.loginData.email=="" || $scope.loginData.email==null || $scope.loginData.password=="" || $scope.loginData.password==null || $scope.loginData.password2=="" || $scope.loginData.password2==null){
        swal("¡Error!", "Debes rellenar todos los campos", "error");
      }else{
        if($scope.loginData.password != $scope.loginData.password2){
          swal("¡Error!", "Las contraseñas introducidas no coinciden", "error");
        }else{
          if(validateEmail($scope.loginData.email)!=true || validateSpamEmail($scope.loginData.email)!=true){
            swal("¡Error!", "Debes introducir un email válido", "error");
          }else {
            $scope.loginData.email = $scope.loginData.email.toLowerCase();
            var response = $http.post('http://eyebetapi.herokuapp.com/registro', $scope.loginData);
            usSpinnerService.spin('spinner');
            response.success(function (data) {
              usSpinnerService.stop('spinner');
              if (data.estado == false)
                swal("¡Error!", data.error, "error");
              else {
                window.localStorage.setItem('token', data.token);
                window.localStorage.setItem('usuario', data.email);
                $scope.irA('app.inicio');
              }
            });
          }
        }
      }
    };

    function validateEmail2(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    function validateEmail(x) {

      var atpos = x.indexOf("@");
      var dotpos = x.lastIndexOf(".");

      if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        return false;
      }else{
        return true;
      }
    }

    function validateForm() {
      var x = document.forms["myForm"]["email"].value;
      var atpos = x.indexOf("@");
      var dotpos = x.lastIndexOf(".");
      if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        alert("Not a valid e-mail address");
        return false;
      }
    }

    function validateSpamEmail(email){
      var devuelve = true;
      if(email.indexOf("@trbvn.com")!=-1){
        devuelve = false;
      }
      return devuelve;
    }

  });
