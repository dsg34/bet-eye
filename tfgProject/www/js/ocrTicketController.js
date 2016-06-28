/**
 * Created by i_d_a on 03/06/2016.
 */
angular.module('starter.controllers')

  .controller('OcrCtrl', function($scope, $http, $ionicModal, $timeout, $cookies, $ionicNavBarDelegate, $cordovaCamera, $state, $document, usSpinnerService) {
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
    var cacheThreshold = -1; //Esta variable se emplea para no leer dos veces la misma imagen si el threshold se mantiene
    $scope.htmlLectura = "";

    $scope.mostrarPopup = false;
    $scope.mostrarPopup2 = false;
    $scope.mostrarPopup3 = false;
    $scope.elegirImagen = true;
    $scope.mostrarImagen = true;

    $scope.mostrando = false;

    $scope.ticket = {};

    var numLineas = 0;

    $scope.capturarTexto = function(){
      console.log("Poh vamo a ver que");
      if(cacheThreshold==$scope.threshold){
        $scope.mostrarPopup = true;
      }else{
        cacheThreshold=$scope.threshold;
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
        usSpinnerService.spin('spinner');
        Tesseract
          .recognize( imagen, {
            lang: 'spa'} )
          .then( function(d){
            textoTicket = d;
            numLineas = 0;
            var array = d.text.split('\n');
            var texto = "";
            /*
             var texto = "<h2>Líneas del ticket</h2>";
             texto += "<p><i ng-click='mostrarAyuda()' class='ayuda fa fa-question-circle'></i></p>";
             */
            for(var i=0; i<array.length; i++){
              if(array[i]!="") {
                texto += '<select id="selLinea'+numLineas+'" name="sel'+numLineas+'">' +
                  '<option value="des">Línea desechable</option>' +
                  '<option value="evento">Evento</option>' +
                  '<option value="resultado">Resultado</option>' +
                  '<option value="tipo_resultado">Tipo/Resultado</option>' +
                  '<option value="cuota">Cuota</option>' +
                  '<option value="hora_evento">Fecha/Hora evento</option>' +
                  '<option value="importe">Importe apostado</option>' +
                  '<option value="premio">Premio</option>' +
                  '</select>';

                texto += '<input type="text" id="linea' + numLineas + '" value="' + array[i] + '" /><br />';
                numLineas++;
              }
            }
            usSpinnerService.stop('spinner');
            $scope.mostrarTexto(texto);
          } );
      }
    }

    $scope.limpiarCanvas = function(){
      var c = document.getElementById("canvasAux");
      var context = c.getContext("2d");

      context.clearRect(0, 0, c.width, c.height);
    }

    $scope.reset = function(){
      console.log($scope.mostrando);
      if(!$scope.$$phase) {
        $scope.$apply(function() {
          $scope.mostrando = true;
        });
      }else{
        $scope.mostrando = true;
      }

      console.log($scope.mostrando);

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

    $scope.reiniciar = function(){

      $scope.mostrando = false;
      document.getElementById("escaner").src = "";
      $scope.limpiarCanvas();
      $scope.imgURI = "";
      location.reload();
    }

    $scope.aplicarThreshold = function(t){
      //$scope.reset();
      $scope.threshold = t;
      usSpinnerService.spin('spinner');
      Caman("#canvasAux", function () {
        this.revert();
        this.threshold(t).render();
        usSpinnerService.stop('spinner');
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
          this.brightness(brillo); // valores entre -100 y 100
        }
        if (contraste != -1){
          this.contrast(contraste); // valores entre -100 y 100
        }
        if (exposicion != -1) {
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
        document.getElementById("escaner").src = "data:image/jpeg;base64," + imageData;
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

    $scope.devuelveFecha = function(){
      var fecha = new Date();
      var dia = fecha.getDate().toString()
      var mes = (fecha.getMonth()+1).toString();
      if(mes.length==1){
        mes = "0"+mes;
      }
      var anyo = fecha.getFullYear().toString();

      var hora = fecha.getHours().toString();
      if(hora.length==1){
        hora = "0"+hora;
      }

      var minutos = fecha.getMinutes().toString();
      if(minutos.length==1){
        minutos="0+minutos";
      }

      var textoFecha = dia + "/" + mes + "/" + anyo+" "+hora+":"+minutos;
      return textoFecha;
    }

    //Cambia el contenido del texto del popup para permitir al usuario almacenar el ticket
    $scope.guardarTicket = function(n, p){
      if(n!="" && n!=null){
        $scope.ticket.nombre = n;
      }else{
        $scope.ticket.nombre = $scope.devuelveFecha();
      }

      if(p!="" && p!=null){
        $scope.ticket.proveedor = p;
      }else{
        $scope.ticket.proveedor = "Sin proveedor";
      }

      $scope.ticket.usuario = window.localStorage.getItem('usuario');

      var response = $http.post('http://eyebetapi.herokuapp.com/api/tickets/', $scope.ticket);
      usSpinnerService.spin('spinner');
      response.success(function (data) {
        usSpinnerService.stop('spinner');
        swal(
          {
            title: "¡Ticket guardado!",
            text: "Su ticket ha sido almacenado correctamente.",
            type: 'success',
            timer: 2500,
            showConfirmButton: false
          }, function(){
            console.log("Se ha cerrado");
            swal.close();
            $state.go('app.detalleTicket', {ticketId: data._id});
          }
        );
      });
    }

    $scope.volverATicket = function(){
      $scope.mostrarPopup2 = false;
      $scope.mostrarPopup3 = false;
      $scope.mostrarPopup = true;
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
        document.getElementById("escaner").src = "data:image/jpeg;base64," + imageData;
        $scope.reset();
      }, function (err) {
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
    }

    //Una vez obtenidas las líneas del ticket tal y como están en él, podemos hacer las llamadas a la API de datos
    $scope.tratarDatos = function(){
      console.log("A tratar!");
      var linea="";
      var contEvento = 0;
      var arrayEventos = [];
      var evento = {};
      var ticket = {};
      for(var i=0; i<numLineas; i++){
        console.log(i);
        linea = document.getElementById("linea"+i.toString()).value;
        //alert(document.getElementById("linea"+ i.toString()).value);

        switch(document.getElementById("selLinea"+ i.toString()).value){
          case "evento":
            if(contEvento!=0) {
              console.log("Evento"+contEvento+": ");
              console.log(evento);
              arrayEventos.push(evento);
              evento = {};
            }
            var equipos = tratarEvento(linea);
            console.log("EVENTO "+contEvento);
            for(var j=0; j<equipos.length; j++){
              console.log("equipo "+j+": "+equipos[j]);
              switch(j){
                case 0: evento.equipo1 = eliminarEspacios(equipos[j]).toUpperCase(); break;
                case 1: evento.equipo2 = eliminarEspacios(equipos[j]).toUpperCase(); break;
                case 2: evento.equipo3 = eliminarEspacios(equipos[j]).toUpperCase(); break;
                case 3: evento.equipo4 = eliminarEspacios(equipos[j]).toUpperCase(); break;
                case 4: evento.equipo5 = eliminarEspacios(equipos[j]).toUpperCase(); break;
                case 5: evento.equipo6 = eliminarEspacios(equipos[j]).toUpperCase(); break;
                default: evento.equipox = eliminarEspacios(equipos[j]).toUpperCase(); break;
              }
            }
            contEvento++;
            evento.texto = linea;
            break;
          case "resultado":
            var array = tratarResultado(linea);

            if(array.length==1){//Resultado
              evento.resultado = eliminarEspacios(array[0]);
            }else if(array.length==2){//Resultado y cuota
              evento.resultado = eliminarEspacios(array[0]);
              evento.cuota = parseFloat(tratarDinero(array[1]).replace(')', '').replace(',', '.'));
            }else if(array.length==3){//Tipo de apuesta, resultado y cuota
              evento.tipo = eliminarEspacios(array[0]);
              evento.resultado = eliminarEspacios(array[1]);
              evento.cuota = parseFloat(tratarDinero(array[2]).replace(')', '').replace(',', '.'));
            }
            break;
          case "tipo_resultado":
            var array = tratarResultado(linea);

            if(array.length==1){//Resultado
              evento.resultado = eliminarEspacios(array[0]);
            }else if(array.length==2){//tipo y resultado
              evento.tipo = eliminarEspacios(array[0]);
              evento.resultado = eliminarEspacios(array[1]);
            }else if(array.length==3){//Tipo, resultado y cuota
              evento.tipo = eliminarEspacios(array[0]);
              evento.resultado = eliminarEspacios(array[1]);
              evento.cuota = parseFloat(tratarDinero(array[2]).replace(')', '').replace(',', '.'));
            }

            break;
          case "hora_evento": evento.hora = linea; break;
          case "importe": ticket.importe = parseFloat(tratarDinero(linea).replace(',', '.')); break;
          case "premio": ticket.premio = parseFloat(tratarDinero(linea).replace(',', '.')); break;
          default: break;
        }
      }
      if(evento!={}){
        arrayEventos.push(evento);
      }
      ticket.eventos = arrayEventos;
      console.log(ticket);
      $scope.ticket = ticket;
      $scope.mostrarPopup=false;
      $scope.mostrarPopup2=true;
    }

    $scope.mostrarAyuda = function(){
      $scope.mostrarPopup=false;
      $scope.mostrarPopup3=true;
    }

    function tratarEvento(linea){
      var arrayEquipos = linea.split('—');
      if(arrayEquipos.length == 1){
        arrayEquipos = linea.split('-');
        if(arrayEquipos.length == 1){
          arrayEquipos = linea.split('/');
          if(arrayEquipos.length == 1){
            arrayEquipos = linea.split('<');
            if(arrayEquipos.length == 1){
              arrayEquipos = linea.split('>');
              if(arrayEquipos.length == 1){
                arrayEquipos = linea.split('»');
              }
              if(arrayEquipos.length == 1){
                arrayEquipos = linea;
              }
            }
          }
        }
      }
      return arrayEquipos;
    }

    function tratarResultado(linea){
      //División para quedarse con la cuota, en caso de que este
      var arrayEquipos = [];
      arrayEquipos = linea.split('(');
      var cuota = "";
      if(arrayEquipos.length>1){
        cuota=arrayEquipos[1];
        linea=arrayEquipos[0];
      }

      arrayEquipos = linea.split('@');
      if(arrayEquipos.length == 1){
        arrayEquipos = linea.split('(');
        if(arrayEquipos.length == 1){
          arrayEquipos = linea.split('—');
          if(arrayEquipos.length == 1){
            arrayEquipos = linea.split('-');
            if(arrayEquipos.length == 1){
              arrayEquipos = linea.split('>');
              if(arrayEquipos.length == 1){
                arrayEquipos = linea.split('»');
              }
              if(arrayEquipos.length == 1){
                arrayEquipos = linea;
              }
            }
          }
        }
      }

      if(cuota!="" && cuota!=null){
        console.log(typeof(arrayEquipos));
        console.log(arrayEquipos);
        if(typeof(arrayEquipos)=="string"){
          var aux = String(arrayEquipos);
          arrayEquipos = [aux, cuota];
        }else{
          arrayEquipos.push(cuota);
        }
      }
      return arrayEquipos;
    }



    function tratarDinero(linea){
      var devuelve = linea.replace('€', '');
      devuelve = devuelve.replace('EUR', '');
      devuelve = devuelve.replace(/[^0-9.,]/g, "");
      devuelve = eliminarEspacios(devuelve);

      return devuelve;
    }

    function eliminarEspacios(palabra){
      console.log(palabra);
      if(palabra!=null){
        while(palabra.length>0 && palabra[0]==' '){
          palabra = palabra.slice(1,palabra.length);
        }

        while(palabra.length>0 && palabra[palabra.length-1]==' '){
          palabra = palabra.slice(0, palabra.length-1);
        }
      }
      return palabra;
    }

    function equipararTiposDeApuesta(tipo){
      switch(removeDiacritics(tipo)){

      }
    }

    document.getElementById("fichero").onchange = function(){
      readURL(this);
    };
  });
