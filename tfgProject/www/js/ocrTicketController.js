/**
 * Created by i_d_a on 03/06/2016.
 */
angular.module('starter.controllers')

  .controller('OcrCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $cordovaCamera, $state) {
    $scope.irA = function(estado){
      $state.transitionTo(estado);
    }

    $scope.$on('$ionicView.enter', function(e) {
      if (window.localStorage.getItem('usuario') == null)
        $scope.irA('login');
    });

    $ionicNavBarDelegate.showBackButton(false);

    Caman.Filter.register("posterize", function (adjust) {
      // Pre-calculate some values that will be used
      var numOfAreas = 256 / adjust;
      var numOfValues = 255 / (adjust - 1);

      // Our process function that will be called for each pixel.
      // Note that we pass the name of the filter as the first argument.
      return this.process("posterize", function (rgba) {
        rgba.r = Math.floor(Math.floor(rgba.r / numOfAreas) * numOfValues);
        rgba.g = Math.floor(Math.floor(rgba.g / numOfAreas) * numOfValues);
        rgba.b = Math.floor(Math.floor(rgba.b / numOfAreas) * numOfValues);

        // Return the modified RGB values
        return rgba;
      });
    });

    //Definimos la función que realiza un threshold sobre la imagen de caman
    Caman.Filter.register("threshold", function (adjust) {
      console.log("Entra threshold");
      return this.process("threshold", function (rgba) {
        var luminance = (0.2126 * rgba.r) + (0.7152 * rgba.g) + (0.0722 * rgba.b)

        if (luminance < adjust){
          rgba.r = 0;
          rgba.g = 0;
          rgba.b = 0;
        }else {
          rgba.r = 255;
          rgba.g = 255;
          rgba.b = 255;
        }

        return rgba
      });
    });

    $scope.imgURI = "";
    $scope.fichero = "";

    $scope.brillo = 0;
    $scope.contraste = 0;
    $scope.exposicion = 0;

    $scope.capturarTexto = function(){
      console.log("Poh vamo a ver que");

      var textoTicket = "";

      /*
       var canvas = document.createElement('canvas');
       var context = canvas.getContext('2d');
       var img = document.getElementById('escaner');
       context.drawImage(img, 0, 0 );
       var imagen = context.getImageData(0, 0, img.width, img.height);
       */
      var imagen = document.getElementById('escaner');

      Tesseract
        .recognize( imagen, {
          lang: 'spa'} )
        .then( function(d){
          textoTicket = d;
          console.log(d.text);
          console.log(d.version);
          alert(d.text);
        } );
      /*
       var textoTicket = OCRAD(imagen, function(text){
       console.log("Ha habido un error");
       console.log(text);
       });
       */
    }

    $scope.aGrises = function(){
      Caman("#escaner", function () {
        this.threshold(80).render();
      });
    }

    $scope.tratarImagen = function(brillo, contraste, exposicion){
      Caman("#escaner", function () {

        if (brillo != -1) {
          console.log("Cambiando brillo: " + brillo);
          this.brightness(brillo); // valores entre -100 y 100
        }
        if (contraste != -1){
          console.log("Cambiando contraste: " + contraste);
          this.contrast(contraste); // valores entre -100 y 100
        }
        if (exposicion != -1) {
          console.log("Cambiando exposición: " + exposicion);
          this.exposure(exposicion); // valores entre -100 y 100
        }

        this.render();
      });
    }

    $scope.tomarFoto = function () {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        targetWidth: 400,
        targetHeight: 800,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        console.log("OK");
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
        $scope.aGrises();
      }, function (err) {
        console.log(err);
        // An error occured. Show a message to the user
      });
    }

    $scope.choosePhoto = function () {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        targetWidth: 400,
        targetHeight: 800,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        console.log("Imagen caputarda"+typeof(imageData));
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
        $scope.aGrises();
      }, function (err) {
        console.log("Palmadovich");
        alert(err);
        // An error occured. Show a message to the user
      });
    }

    $scope.irA = function(estado){
      $state.transitionTo(estado);
    }

    function readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          //$('#blah').attr('src', e.target.result);
          document.getElementById("escaner").src = e.target.result;
          //$scope.imgURI = e.target.result;
          //console.log($scope.imgURI);
          console.log("Hecho");
          $scope.aGrises();
        }

        reader.readAsDataURL(input.files[0]);
      }
    }
    document.getElementById("fichero").onchange = function(){
      readURL(this);
    };
  });
