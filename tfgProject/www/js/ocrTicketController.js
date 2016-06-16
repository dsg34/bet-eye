/**
 * Created by i_d_a on 03/06/2016.
 */
angular.module('starter.controllers')

  .controller('OcrCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $cordovaCamera, $state, $document) {
    $scope.irA = function(estado){
      $state.transitionTo(estado);
    }

    $scope.$on('$ionicView.enter', function(e) {
      if (window.localStorage.getItem('usuario') == null)
        $scope.irA('login');
    });

    $ionicNavBarDelegate.showBackButton(false);


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

    $scope.threshold = 120;
    $scope.htmlLectura = "";

    $scope.mostrarPopup = false;

    var numLineas = 0;

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
      //var imagen = document.getElementById('escaner');
      var imagen = document.getElementById('canvasAux');

      Tesseract
        .recognize( imagen, {
          lang: 'spa'} )
        .then( function(d){
          textoTicket = d;
          numLineas = 0;
          var array = d.text.split('\n');
          console.log("------------------");
          var texto = "";
          /*
          var texto = "<h2>Líneas del ticket</h2>";
          texto += "<p><i ng-click='mostrarAyuda()' class='ayuda fa fa-question-circle'></i></p>";
          */
          for(var i=0; i<array.length; i++){
            console.log("Línea "+i);
            console.log(array[i]);
            if(array[i]!="") {
              texto += '<select id="selLinea'+i+'" name="sel'+i+'">' +
                '<option value="des">Línea desechable</option>' +
                '<option value="evento">Evento</option>' +
                '<option value="resultado">Resultado</option>' +
                '<option value="hora_evento">Hora evento</option>' +
                '<option value="importe">Importe apostado</option>' +
                '<option value="premio">Premio</option>' +
                '</select>';
              //texto += '<input type="checkbox" id="check' + i + '"/>';
              texto += '<input type="text" id="linea' + i + '" value="' + array[i] + '" /><br />';
              numLineas++;
            }
          }

          //texto += '<button id="cancelarTicket" class="cancelar">Cancelar</button><button id="aceptarTicket" class="aceptar">Aceptar</button>'
          console.log(texto);
          $scope.mostrarTexto(texto);
        } );
    }

    $scope.reset = function(){
      var c = document.getElementById("canvasAux");
      var ctx = c.getContext("2d");
      var img = document.getElementById("escaner");
      c.width=img.width;
      c.height=img.height;
      ctx.drawImage(img, 0, 0);
      Caman("#canvasAux", function () {
        this.revert();
      });
    }


    $scope.aplicarThreshold = function(t){
      //$scope.reset();
      console.log(t);
      Caman("#canvasAux", function () {
        this.revert();
        this.threshold(t).render();
      });
    }

    $scope.aGrises = function(){
      Caman("#canvasAux", function () {
        this.threshold(80).render();
      });
    }

    $scope.tratarImagen = function(brillo, contraste, exposicion){
      Caman("#canvasAux", function () {

        this.revert();
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
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        console.log("OK");
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
        $scope.reset();
      }, function (err) {
        console.log(err);
        // An error occured. Show a message to the user
      });
    }

    $scope.mostrarTexto = function(texto){
      document.getElementById("popContenido").innerHTML = texto;

      $scope.$apply(function() {
        $scope.mostrarPopup = true;
      });
    }

    $scope.choosePhoto = function () {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
        $scope.reset();
      }, function (err) {
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
          $scope.reset();
        }

        reader.readAsDataURL(input.files[0]);
      }
    }

    $scope.cerrarPopup = function(){
      $scope.mostrarPopup = false;
      $scope.$apply();
    }

    //Una vez obtenidas las líneas del ticket tal y como están en él, podemos hacer las llamadas a la API de datos
    $scope.tratarDatos = function(){
      console.log("A tratar!");
      for(var i=0; i<numLineas; i++){
        if(document.getElementById("check"+ i.toString()).checked){
          //Ya tengo las
          alert(document.getElementById("linea"+ i.toString()).value);
        }
      }

    }

    $scope.mostrarAyuda = function(){
      var explicacion = "<div style='text-align:left;'><span class='spanPrin'>Para que analicemos correctamente el ticket, debes:</span> <br /><br /> " +
        "<span class='spanSec'><b>-</b>Corregir los errores que se hayan producido</span>" +
        "<span class='spanSec'><b>-</b>Indicar el tipo de contenido de cada línea</span>" +
        "<span class='spanSec'><b>-</b>Dejar los eventos en el formato <b>Equipo1 - Equipo2</b>. Ej.: Real Madrid-F.C. Barcelona</span>" +
        "<span class='spanSec'><b>-</b>Dejar sólo los resultados de evento en las líneas que correspondan a estos.</span>"
      swal({
        title: "Instrucciones",
        text: explicacion,
        html: true,
        allowOutsideClick: true,
      });
    }

    document.getElementById("fichero").onchange = function(){
      readURL(this);
    };
  });
