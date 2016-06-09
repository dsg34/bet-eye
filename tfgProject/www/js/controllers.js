angular.module('starter.controllers', [])

  .controller('AppCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $state, $ionicNavBarDelegate, $ionicSideMenuDelegate) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.irA = function(estado){
      $state.go(estado);
    }

    $scope.$on('$ionicView.enter', function(e) {
      if ($state.current.url == '/login' && window.localStorage.getItem('usuario') != null) {
        $scope.irA("app.inicio");
      }
    });


    // Form data for the login modal
    $scope.loginData = {};
    $ionicNavBarDelegate.showBackButton(false);
    /*
     // Create the login modal that we will use later
     $ionicModal.fromTemplateUrl('templates/login.html', {
     scope: $scope
     }).then(function(modal) {
     $scope.modal = modal;
     });
     */

    // Triggered in the login modal to close it
    /*
     $scope.closeLogin = function() {
     $scope.modal.hide();
     };
     */

    $scope.inicio = function () {
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.inicio');
      //window.location = '/#/app/inicio';
    }

    // Open the login modal
    $scope.login = function () {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('usuario');
      $scope.irA("login");
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log($scope.loginData);
      if ($scope.loginData.email == "" || $scope.loginData.email == null || $scope.loginData.password == "" || $scope.loginData.password == null) {
        swal("¡Error!", "Debes rellenar todos los campos", "error");
      } else {
        var response = $http.post('http://eyebetapi.herokuapp.com/login', $scope.loginData);
        response.success(function (data) {
          if (data.estado == false)
            swal("¡Error!", data.error, "error");
          else {
            window.localStorage.setItem('token', data.token);
            window.localStorage.setItem('usuario', data.email);
            console.log(window.localStorage.getItem('usuario'));
            $scope.irA("app.inicio");
          }
        });
      }
    };

    $scope.cambiarPassword = function () {
      swal({
        title: "¿Has olvidado tu contraseña?",
        text: "Introduce tu correo electrónico y te enviaremos tu nueva contraseña:",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "email"
      }, function (inputValue) {
        if (inputValue === false) return false;
        if (inputValue === "") {
          swal.showInputError("Debes escribir tu correo electrónico");
          return false
        }else{
          var url = 'http://eyebetapi.herokuapp.com/send';

          var response = $http.post(url, {email: inputValue});
          response.success(function (data) {
            if(data.estado==false){
              swal("¡Error!", data.error, "error");
            }else{
              swal("¡Hecho!", "Hemos enviado a tu correo " + inputValue + " tu nueva contraseña.", "success");
            }
          });
        }
      });
    }

  });

