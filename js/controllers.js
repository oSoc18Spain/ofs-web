app.controller('mainController', function (
  $rootScope,
  $scope,
  $location,
  authFactory,
  userFactory
) {
  var path = window.location.pathname;
  var dir = path.slice(1); //poner a 1 al subir a venus
  var selected; //clase activa navbar

  // Ajuste path - navbar
  if (dir == 'contacto') {
    $('.nav')
      .find('.active')
      .removeClass('active');
    $('#contact').addClass('active');
  } else if (dir == 'acerca') {
    $('.nav')
      .find('.active')
      .removeClass('active');
    $('#about').addClass('active');
  } else if (dir == 'equipamiento') {
    $('.nav')
      .find('.active')
      .removeClass('active');
    $('#equip').addClass('active');
  } else if (dir == 'inicio') {
    $('.nav')
      .find('.active')
      .removeClass('active');
    $('#init').addClass('active');
  }

  $('#logo').click(function () {
    $('.nav')
      .find('.active')
      .removeClass('active');
    $('#init').addClass('active');
  });
  // End Ajuste path - navbar

  $scope.goLogin = function () {
    $location.path('/iniciarsesion');
    $('#init').addClass('active');
  };

  $scope.goRegister = function () {
    $location.path('/registrar');
  };

  $scope.goRecoveryPassword = function () {
    $location.path('/recuperarcontrasena');
    // $('#init').addClass('active');
  };

  $scope.goProfile = function () {
    $location.path('/perfil');
    $('.nav')
      .find('.active')
      .removeClass('active');
    $('#profile').addClass('active');
  };

  $scope.toLogout = function () {
    authFactory.toLogout();
    userFactory.setIsLogged(false);
    $rootScope.isLogged = userFactory.getIsLogged();
    $('#init').addClass('active');
  };

  if ($(window).width() < 1200) {
    $('.navbar .container').addClass('container-fluid');
    $('.navbar .container').removeClass('container');
  } else if ($(window).width() > 1200) {
    $('.navbar .container-fluid').addClass('container');
    $('.navbar .container-fluid').removeClass('container-fluid');
  }

  $(window).on('resize', function () {
    if ($(window).width() < 1200) {
      $('.navbar .container').addClass('container-fluid');
      $('.navbar .container').removeClass('container');
    } else if ($(window).width() > 1200) {
      $('.navbar .container-fluid').addClass('container');
      $('.navbar .container-fluid').removeClass('container-fluid');
    }
  });

  $rootScope.isLogged = userFactory.getIsLogged();
});

app.controller('inicioController', [
  '$scope',
  '$sce',
  '$http',
  'httpFactory',
  function ($scope, $sce, $http, httpFactory) {
    //Estado observatorio
    $scope.state = {};
    $scope.state.weatherStation = true; //OK
    $scope.state.availabilityMount =
      "Estado de la montura: <span class='dome-red'>NO DISPONIBLE</span>";
    $scope.state.availabilityWeatherStation =
      "Estado de la estación meteorológica: <span class='dome-red'>NO DISPONIBLE</span>";
    $scope.state.availabilityMount =
      "Estado de la montura: <span class='dome-red'>NO DISPONIBLE</span>";
    $scope.state.availabilityCameras =
      "Estado de las cámaras: <span class='dome-green'>DISPONIBLE</span>";

    // Estado estacion meteorologica
    httpFactory
      .async('api/weatherstation/status', 'GET')
      .then(function successCallback(response) {
        if (response.status === 200) {
          const status = response.data;
          if (status.active) {
            $scope.state.weatherStation = true;
            $scope.state.temperature = status.temperature;
            $scope.state.pressure = status.pressure;
            $scope.state.humidity = status.humidity;
            $scope.state.rainfall = status.rainFall;
            $scope.state.windSpeed = status.windSpeed;
            $scope.state.windDirection = status.windDirection;
            $scope.state.timestamp = status.timestamp;
            $scope.state.availabilityWeatherStation =
              "Estado de la estación meteorológica: <span class='dome-green'>DISPONIBLE</span>";
          } else {
            $scope.state.weatherStation = false; //ERROR
            $scope.state.timestamp = status.timestamp;
            $scope.state.availabilityWeatherStation =
              "Estado de la estación meteorológica: <span class='dome-red'>NO DISPONIBLE</span>";
          }
        } else {
          $scope.state.weatherStation = false; //ERROR
          $scope.state.availabilityWeatherStation =
            "Estado de la estación meteorológica: <span class='dome-red'>NO DISPONIBLE</span>";
        }
      });

    // Estado montura
    httpFactory
      .async('api/mount/status', 'GET')
      .then(function successCallback(response) {
        if (response.status === 200) {
          if (response.data.active) {
            $scope.state.availabilityMount =
              "Estado de la montura: <span class='dome-green'>DISPONIBLE</span>";
          } else {
            $scope.state.availabilityMount =
              "Estado de la montura: <span class='dome-red'>NO DISPONIBLE</span>";
          }
        } else {
          $scope.state.availabilityMount =
            "Estado de la montura: <span class='dome-red'>NO DISPONIBLE</span>";
        }
      });

    // Estado Cupula
    httpFactory
      .async('api/dome/status', 'GET')
      .then(function successCallback(response) {
        if (response.status === 200) {
          if (response.data.status && response.data.shutter === 'open') {
            $scope.state.availabilityDome =
              "Estado de la cúpula: <span class='dome-green'>DISPONIBLE, ABIERTA</span>";
          } else if (
            response.data.status &&
            response.data.shutter === 'closed'
          ) {
            $scope.state.availabilityDome =
              "Estado de la cúpula: <span class='dome-green'>DISPONIBLE, CERRADA</span>";
          } else {
            $scope.state.availabilityDome =
              "Estado de la cúpula: <span class='dome-red'>NO DISPONIBLE</span>";
          }
        } else {
          $scope.state.availabilityDome =
            "Estado de la cúpula: <span class='dome-red'>NO DISPONIBLE</span>";
        }
      });

    $scope.cameraFile = 'img/cameraObs.jpg';
    // Seleccion de camara
    $scope.SelectCamera = function () {
      var date = new Date();
      var time = date.getTime();
      if ($scope.camera === 'interior1') {
        $scope.cameraFile = '/api/internalCamera/1';
      } else if ($scope.camera === 'interior2') {
        $scope.cameraFile = '/api/internalCamera/2';
      } else if ($scope.camera === 'exterior') {
        $scope.cameraFile = '/api/externalCamera';
      }
    };

    //Modal imagen
    if ($(window).width() > 767) {
      var $lightbox = $('#lightbox');
      $('.thumbnail').on('click', function (event) {
        var $img = $(this).find('img'),
          src = $img.attr('src'),
          alt = $img.attr('alt');
        // css = {
        //     'maxWidth': $(window).width() - 100,
        //     'maxHeight': $(window).height() - 100
        // };

        $lightbox.find('.close').addClass('hidden');
        $lightbox.find('img').attr('src', src);
        $lightbox.find('img').attr('alt', alt);
        // $lightbox.find('img').css(css);
      });

      $lightbox.on('shown.bs.modal', function () {
        var $img = $lightbox.find('img');

        $lightbox.find('.modal-dialog').css({
          width: $img.width()
        });
        $lightbox.find('.close').removeClass('hidden');
      });
    } else {
      $('.thumbnail').removeAttr('data-toggle');
    }
  }
]);

app.controller('equipamientoController', [
  '$scope',
  '$sce',
  '$http',
  function ($scope, $sce, $http) {}
]);
app.controller('acercaController', [
  '$scope',
  '$sce',
  '$http',
  function ($scope, $sce, $http) {}
]);

app.controller('contactoController', [
  '$scope',
  '$sce',
  '$http',
  function ($scope, $sce, $http) {}
]);

app.controller('registrarController', [
  '$rootScope',
  '$scope',
  '$sce',
  '$http',
  'authFactory',
  'userFactory',
  function ($rootScope, $scope, $sce, $http, authFactory, userFactory) {
    $('.nav')
      .find('.active')
      .removeClass('active');
    $('#form-login').hide();
    $('#form-recoveryPassword').hide();
    $('#h2_log').hide();
    $('#h2_repass').hide();

    // $rootScope.user = {};
    // $rootScope.isLogged = userFactory.getIsLogged();

    $scope.user = {};
    $scope.user.nameRegister = null;
    $scope.user.emailRegister = null;
    $scope.user.passwordRegister1 = null;
    $scope.user.passwordRegister2 = null;
    $scope.user.isLogged = false;

    $scope.register = {};
    $scope.register.errorName = false;
    $scope.register.errorEmail = false;
    $scope.register.errorPassword = false;
    $scope.register.errorEnvio = false;

    $scope.toRegister = function () {
      //validar entradas
      if ($scope.user.passwordRegister1 !== $scope.user.passwordRegister2) {
        $scope.register.errorPassword = true;
      } else {
        $scope.register.errorPassword = false;
        userFactory.setName($scope.user.nameRegister);
        userFactory.setEmail($scope.user.emailRegister);
        userFactory.setPassword($scope.user.passwordRegister1);
        $('#form-submit-reg').hide();
        $('#register-gif').show();

        $http({
          url: 'api/register',
          method: 'POST',
          data: {
            username: $scope.user.nameRegister,
            email: $scope.user.emailRegister,
            password: $scope.user.passwordRegister1
          }
        }).then(
          function successCallback(response) {
            if (response.status === 201) {
              // Si registro correcto, mostar mensaje
              $('#login-gif').hide();
              $('#form-register').hide();
              $('#confirmEmail').show();
            }
            // return response;
          },
          function errorCallback(response) {
            $('#register-gif').hide();
            $('#form-submit-reg').show();
            $scope.register.errorEnvio = true;
          }
        );
      }
    };
  }
]);

app.controller('loginController', [
  '$rootScope',
  '$scope',
  '$sce',
  '$http',
  '$location',
  'authFactory',
  'userFactory',
  'Base64',
  'httpFactory',
  function (
    $rootScope,
    $scope,
    $sce,
    $http,
    $location,
    authFactory,
    userFactory,
    Base64,
    httpFactory
  ) {
    $('.nav')
      .find('.active')
      .removeClass('active');
    $('#form-register').hide();
    $('#form-recoveryPassword').hide();
    $('#h2_reg').hide();
    $('#h2_repass').hide();

    $rootScope.user = {};
    $rootScope.isLogged = userFactory.getIsLogged();

    $scope.user = {};
    $scope.user.nameLogin = null;
    $scope.user.passwordLogin = null;
    $scope.user.isLogged = false;
    $scope.user.email = null;
    $scope.user.rol = null;
    $scope.user.token = null;

    $scope.login = {};
    $scope.login.errorName = false;
    $scope.login.errorPassword = false;
    $scope.login.errorEnvio = false;

    // app.run(function($http) {
    //   $http.defaults.headers.common.Authorization = 'Basic YWRtaW5pc3RyYXRvcjoxMjM0NTY3OA==';
    // });

    //funcion para conectar
    // TO DO
    $scope.toLogin = function () {
      if (
        ($scope.user.nameLogin != null) &
        ($scope.user.passwordLogin != null)
      ) {
        userFactory.setName($scope.user.nameLogin);
        userFactory.setPassword($scope.user.passwordLogin);
        $('#form-submit-log').hide();
        $('#login-gif').show();

        var auth64 = Base64.encode(
          $scope.user.nameLogin + ':' + $scope.user.passwordLogin
        );
        var basic = 'Basic ' + auth64;

        // $http.defaults.headers.common.Authorization = basic;
        // $http.defaults.headers.common['Access-Control-Allow-Origin'] = "*";
        // $http.defaults.headers.common['Access-Control-Allow-Methods'] = "GET,PUT,POST,DELETE,OPTIONS";
        // $http.defaults.headers.common['Access-Control-Allow-Headers'] = "Content-Type, Authorization, Content-Length, X-Requested-With";

        $http({
            url: 'api/login',
            method: 'POST',
            data: {
              username: $scope.user.nameLogin,
              password: $scope.user.passwordLogin
            }
          })
          .then(function successCallback(response) {
            // console.log(response);
            if (response.status == 200) {
              // console.log(response.data);
              userFactory.setToken(response.data.token);
              authFactory.toLogin(userFactory.getToken()); //cokiee
              $rootScope.user.isLogged = true;
              $scope.user.isLogged = true;
              userFactory.setIsLogged(true);

              // una vez hecho login recuperamos los datos del usuario
              httpFactory
                .auth('api/users/logged', 'GET')
                .then(function success(response) {
                  userFactory.setEmail(response.data.email);
                  userFactory.setName(response.data.username);
                  $location.path('/perfil');
                });
            }
          })
          .catch(p => {
            $('#form-submit-log').show();
            $('#login-gif').hide();
            $scope.login.errorEnvio = true;
          });
      }
    };
  }
]);

app.controller('experimentoController', [
  '$rootScope',
  '$scope',
  '$sce',
  '$http',
  'httpFactory',
  'userFactory',
  function ($rootScope, $scope, $sce, $http, httpFactory, userFactory) {
    //Calendario
    $.datepicker.regional['es'] = {
      closeText: 'Cerrar',
      prevText: 'Sig',
      currentText: 'Hoy',
      monthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
      ],
      monthNamesShort: [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic'
      ],
      dayNames: [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado'
      ],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié;', 'Juv', 'Vie', 'Sáb'],
      dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
      weekHeader: 'Sm',
      dateFormat: 'yy-mm-dd',
      firstDay: 1,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: ''
    };

    $.datepicker.setDefaults($.datepicker.regional['es']);
    $('#datepicker').datepicker({
      firstDay: 1,
      minDate: 0,
      maxDate: '14D'
    });

    // Variables del template
    $scope.daySelected = undefined;
    $scope.reservationError = false;
    $scope.reservationOk = false;
    $scope.showSlots = false;
    $scope.slots = [];
    $scope.slotsSelected = [];
    // Tiempo reserva
    $scope.startTime = undefined;
    $scope.endTime = undefined;
    $scope.totalTime = 0;

    $scope.confirmDate = function () {
      $scope.slots = [];
      $scope.slotsSelected = [];
      $scope.dayError = false;
      $scope.startTime = undefined;
      $scope.endTime = undefined;
      $scope.totalTime = 0;
      $scope.daySelected = $('#datepicker').val();

      // Comrpobar que hay un día seleccionado
      if (!$scope.daySelected) {
        $scope.dayError = true;
        return;
      }

      // Reservations from 22h to 06h
      const startReservation = moment($scope.daySelected)
        .hour(22)
        .minute(0)
        .second(0);
      const endReservation = moment($scope.daySelected)
        .add(1, 'days')
        .hour(6)
        .minute(0)
        .second(0);

      // Format date
      const endDateStr = moment($scope.daySelected)
        .add(1, 'days')
        .format('YYYY-MM-DD');

      // Pedir reservas del día seleccionado y el siguiente
      $scope.loading = true;
      const url =
        'api/reservations?start=' + $scope.daySelected + '&end=' + endDateStr;
      httpFactory.auth(url, 'GET').then(function success(response) {
        if (response.status === 200) {
          $scope.showSlots = true;

          const reservationList = response.data.filter(r => r.status === 1);
          let contId = 1;

          // Ver rangos disponibles
          while (!startReservation.isSame(endReservation)) {
            let slot = {
              startDate: moment(startReservation),
              endDate: moment(startReservation.add(15, 'm'))
            };

            // Evitar solapes
            if (!reservationList.some(
                r =>
                slot.startDate.isBetween(
                  r.startDate,
                  r.endDate,
                  null,
                  '[)'
                ) ||
                slot.endDate.isBetween(r.startDate, r.endDate, null, '(]')
              )) {
              // Convertir a Date para mostrar en el front
              slot.startDate = slot.startDate.toDate();
              slot.endDate = slot.endDate.toDate();
              slot.id = contId++;
              $scope.slots.push(slot);
            }
          }
        }
      });
    };

    $scope.selectSlot = function (slot) {
      if ($scope.slotsSelected.length === 0) {
        $scope.slotsSelected.push(slot);
        $scope.startTime = slot.startDate;
        $scope.endTime = slot.endDate;
        $scope.totalTime = -moment(slot.startDate).diff(slot.endDate, 'm');
      } else {
        const last = $scope.slotsSelected[$scope.slotsSelected.length - 1];
        const duration = -moment($scope.startTime).diff(slot.endDate, 'm');

        // Comprobar que el slot es consecutivo y que no supera las 3 horas de duración
        if (
          moment(last.endDate).isSame(moment(slot.startDate)) &&
          duration <= 180
        ) {
          $scope.slotsSelected.push(slot);
          $scope.endTime = slot.endDate;
          $scope.totalTime = duration;
        }
      }
    };

    $scope.confirmReservation = function () {
      $scope.reservationError = false;
      $scope.reservationOk = false;

      const body = {
        startDate: moment($scope.startTime).format('YYYY-MM-DDTHH:mm'),
        endDate: moment($scope.endTime).format('YYYY-MM-DDTHH:mm')
      };

      httpFactory.auth('api/reservations', 'POST', body).then(
        function success(response) {
          if (response.status === 201) {
            $scope.reservationOk = true;
          } else {
            $scope.reservationError = true;
          }
        },
        function error() {
          $scope.reservationError = true;
        }
      );
    };
  }
]);

app.controller('perfilController', [
  '$scope',
  '$sce',
  '$http',
  '$location',
  '$route',
  'httpFactory',
  'userFactory',
  function ($scope, $sce, $http, $location, $route, httpFactory, userFactory) {
    $scope.user = {};
    $scope.user.name = '';
    $scope.user.email = '';

    $scope.reservations = [];
    $scope.selectedReservationId = 0;
    $scope.selectedReservation = {};
    $scope.reservationActualError = false;

    $scope.reservationStatus = {
      1: 'Pendiente',
      2: 'Completada',
      3: 'Cancelada'
    };

    // Obtener datos usuario
    httpFactory
      .auth('api/users/logged', 'GET')
      .then(function success(response) {
        userFactory.setEmail(response.data.email);
        userFactory.setName(response.data.username);

        $scope.user.name = userFactory.getName();
        $scope.user.email = userFactory.getEmail();
      });

    httpFactory
      .auth('api/reservations/own', 'GET')
      .then(function success(response) {
        if (response.status === 200) {
          $scope.reservations = response.data;
        }
      });

    $scope.selectElement = function (id) {
      $scope.selectedReservationId = id;
      $scope.selectedReservation = $scope.reservations.filter(
        r => r.id === id
      )[0];
    };

    // Cancelar reserva
    $scope.removeReservation = function () {
      const url =
        'api/reservations/' + $scope.selectedReservationId + '/cancel';
      httpFactory.auth(url, 'PUT').then(function success(response) {
        if (response.status === 200) {
          $route.reload();
        }
      });
    };

    // Ir a reserva si es la actual
    $scope.goToObservation = function () {
      $scope.reservationActualError = false;
      httpFactory.auth('api/reservations/actual', 'GET').then(
        function success(response) {
          if (
            response.status === 200 &&
            response.data.id === $scope.selectedReservationId
          ) {
            $location.path('/observacion');
          } else {
            $scope.reservationActualError = true;
          }
        },
        function error() {
          $scope.reservationActualError = true;
        }
      );
    };
  }
]);

app.controller('observacionController', [
  '$scope',
  '$sce',
  '$http',
  '$interval',
  'httpFactory',
  'userFactory',
  function ($scope, $sce, $http, $interval, httpFactory, userFactory) {
    // Tiempo restante reserva
    $scope.timeLeft = '';
    let stopInterval;
    let endReservation;

    httpFactory
      .auth('api/reservations/actual', 'GET')
      .then(function success(response) {
        if (response.status === 200) {
          endReservation = moment(response.data.endDate);
          stopInterval = $interval(updateTime, 1000);
        }
      });

    function updateTime() {
      const duration = moment.duration(endReservation.diff(moment()));
      $scope.timeLeft =
        duration.hours() + ':' + duration.minutes() + ':' + duration.seconds();
      if (duration < 0) {
        $interval.cancel(stopInterval);
        $scope.timeLeft = 'FINALIZADA';
      }
    }

    // Estado estacion meteorologica
    $scope.state = {};
    $scope.state.weatherStation = false;

    httpFactory
      .async('api/weatherstation/status', 'GET', '')
      .then(function successCallback(response) {
        if (response.status === 200) {
          var status = response.data;
          if (status.active) {
            $scope.state.weatherStation = true;
            $scope.state.temperature = status.temperature;
            $scope.state.pressure = status.pressure;
            $scope.state.humidity = status.humidity;
            $scope.state.rainfall = status.rainFall;
            $scope.state.windSpeed = status.windSpeed;
            $scope.state.windDirection = status.windDirection;
            $scope.state.timestamp = status.timestamp;
          } else {
            $scope.state.weatherStation = false;
            $scope.state.timestamp = status.timestamp;
          }
        } else {
          $scope.state.weatherStation = false;
        }
      });

    // Recarga de imágenes de camaras
    $scope.externalCamera = 'api/externalCamera';
    $scope.internalCamera = 'api/internalCamera/1';

    $interval(reloadImages, 30000); //30 sec
    function reloadImages() {
      $scope.externalCamera = 'api/externalCamera' + '?timestamp=' + moment();
      $scope.internalCamera = 'api/internalCamera/1' + '?timestamp=' + moment();
    }

    // Obtener foto
    $scope.takePhoto = function () {
      httpFactory
        .auth('api/camera/takePhoto', 'POST')
        .then(function successCallback(response) {
          if (response.status === 200) {
            console.log('Id de la foto: ' + response.data.id);
            // TODO: Obtener foto
          }
        });
    };

    // Movimiento montura
    $scope.coordinates = {};
    $scope.coordinates.rightAscension = '';
    $scope.coordinates.declination = '';

    $scope.sendCoordinates = function () {
      httpFactory.auth('api/mount/move', 'PUT', $scope.coordinates);
    };

    $scope.moveUP = function () {
      httpFactory.auth('api/mount/step', 'POST', {
        direction: 'Up'
      });
    };

    $scope.moveDown = function () {
      httpFactory.auth('api/mount/step', 'POST', {
        direction: 'Down'
      });
    };

    $scope.moveRight = function () {
      httpFactory.auth('api/mount/step', 'POST', {
        direction: 'Right'
      });
    };

    $scope.moveLeft = function () {
      httpFactory.auth('api/mount/step', 'POST', {
        direction: 'Left'
      });
    };

    // Parametros de la camara
    $scope.param = {};
    $scope.param.brightness = 50;
    $scope.param.gamma = 50;
    $scope.param.exposure = 1;

    $scope.confPhoto = function () {
      httpFactory.auth('api/camera/status', 'PUT', $scope.param);
    };

    // Abrir cupula
    $scope.openDome = function () {
      httpFactory.auth('api/dome/open', 'PUT');
    };

    // Cerrar cupula
    $scope.closeDome = function () {
      httpFactory.auth('api/dome/close', 'PUT');
    };
  }
]);

app.controller('recoverypasswordController', [
  '$rootScope',
  '$scope',
  '$sce',
  '$http',
  'authFactory',
  'userFactory',
  function ($rootScope, $scope, $sce, $http, authFactory, userFactory) {
    $('#form-login').hide();
    $('#form-register').hide();
    $('#h2_log').hide();
    $('#h2_reg').hide();

    $scope.user = {};
    $scope.user.nameRecoveryPassword = null;
    $scope.user.emailRecoveryPassword = null;

    $scope.recoveryPassword = {};
    $scope.recoveryPassword.error = false;

    $scope.toRecoveryPassword = function () {
      // Peticion REST comprobar el email.
      // to-do
      $('#recoveryPassword').show();
      $('#form-recoveryPassword').hide();
    };
  }
]);

app.controller('imagesController', [
  '$scope',
  '$sce',
  '$http',
  function ($scope, $sce, $http) {
    // Get test pictures
    // Resolution: 1280 * 960
    pictures_id = ['1pLROvOVU9mQE2WjKLystbURuemB-hCcw', '1x4ZIYO3PnqWuMhdTZFmfStNPWIEc6giu', '1FuvR1fRg49rhHf28eNP0pbNPlT3Rfol3', '1alcUY1yhuCAC3OjOchlpbOxUs0T8hx5s', '1CSWvltFyhEAicbmNCfP94oLj6APlHn5-', '19I2u5ypw-SjHUMmVDh-6s5SMSF5cOKMy', '1FyOn0x9xNSEwV12x60As0h56xoKlFzJN', '1Y3SRZ5n8JdyJpz0ZdJIYVRlkEUASSFYw', '1RyPsy5sSjnx1COyG0KQsioienNsYSV9w', '12GvH-h0jfXHZEniqTuO77fWMpOUoDqv8']
    pictures = [];
    for (let i = 0; i < pictures_id.length; i++) {
      pictures[i] = `https://lh3.google.com/u/0/d/${pictures_id[i]}`;
    }
    $scope.pictures = pictures;
    $scope.showFullScreenImg = false;
    $scope.showDescription = false;
    $scope.viewImages = true;

    //Get conf
    $scope.observations = [{
        'time': new Date(),
        'user': 'Random 1',
        'tags': ['Saturno', 'cielo']
      },
      {
        'time': new Date(),
        'user': 'Random 2',
        'tags': ['moon', 'night', 'close-moon', 'moon', 'night', 'close-moon', ]
      }
    ]
    $scope.viewConf = false;

    $scope.switchActiveTab = (page) => {
      if (page === 'img') {
        $('.img').addClass('active');
        $('.conf').removeClass('active');
        $scope.viewImages = true;
        $scope.viewConf = false;
      } else if (page === 'conf') {
        $('.conf').addClass('active');
        $('.img').removeClass('active');
        $scope.viewImages = false;
        $scope.viewConf = true;
      }
    }

    let busy = false;
    $scope.swiperight = () => {
      let currentMargin = $('.img__carrousel-list').css('marginLeft');
      currentMargin = currentMargin.substring(0, currentMargin.length - 2);
      let min = window.innerWidth / 2 - 45;
      let max = min - $(`.img__carrousel img`).width() * $scope.pictures.length;
      let futureMargin =
        parseInt(currentMargin) - parseInt(window.innerHeight) * 0.7;

      if (!busy) {
        if (futureMargin <= max) {
          $('.img__carrousel-list').css('marginLeft', `${max}px`);
        } else {
          $('.img__carrousel-list').css('marginLeft', `${futureMargin}px`);
        }
        busy = true;
        setTimeout(() => {
          busy = false;
        }, 300);
      }
    };
    $scope.swipeleft = () => {
      let currentMargin = $('.img__carrousel-list').css('marginLeft');
      currentMargin = currentMargin.substring(0, currentMargin.length - 2);
      let min = 50;

      let futureMargin =
        parseInt(currentMargin) + parseInt(window.innerWidth) * 0.7;

      if (!busy) {
        if (futureMargin >= min && !busy) {
          $('.img__carrousel-list').css('marginLeft', `${min}px`);
        } else {
          $('.img__carrousel-list').css('marginLeft', `${futureMargin}px`);
        }
        busy = true;
        setTimeout(() => {
          busy = false;
        }, 300);
      }
    };
    $scope.openImg = (event, index) => {
      $scope.showFullScreenImg = true;
      $scope.isDownloadOpen = false;
      $scope.imageUrl = event.originalTarget.attributes[0].textContent;
      setTimeout(() => {
        $(`.img__carrousel img`).css({
          transform: 'scale(1)',
          margin: '10px 5px'
        });

        let offset =
          index * $(`.img__carrousel img:nth-child(${index + 1})`).width();
        let margin = window.innerWidth * 0.5 - 45 - offset;
        if (margin < 50)
          $('.img__carrousel-list').css('marginLeft', margin + 'px');
        else $('.img__carrousel-list').css('marginLeft', '55px');

        $(`.img__carrousel img:nth-child(${index + 1})`).css({
          transform: 'scale(1.2)',
          margin: '0 10px'
        });
      }, 1);

      //change url for sharing
      setTimeout(() => {

        let sharing_text = 'Mira que foto desde @ciclopegroup.'
        let tw_url = `https://twitter.com/intent/tweet?url=${$scope.imageUrl}&text=${sharing_text}`;
        let fb_url = `https://www.facebook.com/sharer/sharer.php?u=${$scope.imageUrl}`;

        $('.share-img_tw').attr('href', tw_url);
        $('.share-img_fb').attr('href', fb_url);
      }, 100)

      //let fb_url = ''
    };

    $scope.closeImg = () => {
      $scope.showFullScreenImg = false;
      $scope.isShareOpen = false;
    };

    $scope.isShareOpen = false;
    $scope.toggleShareOptions = () => {
      if ($scope.isShareOpen)
        $scope.showShareOptions(0, 'hidden', '-20px')
      else
        $scope.showShareOptions(1, 'inherit', '1px')
    }

    $scope.showShareOptions = (opacity, visibility, mtop) => {
      $scope.isShareOpen = !$scope.isShareOpen;
      let shareOptions = document.getElementById('shareOptions');
      shareOptions.style.setProperty('opacity', opacity);
      shareOptions.style.setProperty('visibility', visibility);
      shareOptions.style.setProperty('--mtop', mtop);
    }

    $scope.downloadImg = () => {
      var a = document.createElement('a');
      a.href = $scope.imageUrl;
      a.target = "_blank";
      a.download = "output.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
  //https://twitter.com/intent/tweet?url=https%3A//youtu.be/zEf423kYfqk&text=bonita foto
  //https://www.facebook.com/login.php?skip_api_login=1&api_key=87741124305&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fv2.7%2Fdialog%2Fshare%3Fredirect_uri%3Dhttps%253A%252F%252Fwww.youtube.com%252Ffacebook_redirect%26display%3Dpopup%26href%3Dhttps%253A%252F%252Fwww.youtube.com%252Fattribution_link%253Fa%253Da4UXAbzYmpc%2526u%253D%25252Fwatch%25253Fv%25253DzEf423kYfqk%252526feature%25253Dshare%26client_id%3D87741124305%26ret%3Dlogin&cancel_url=https%3A%2F%2Fwww.youtube.com%2Ffacebook_redirect%3Ferror_code%3D4201%26error_message%3DUser%2Bcanceled%2Bthe%2BDialog%2Bflow%23_%3D_&display=popup&locale=es_ES
]);

//imagenes, todos los archivos y (mis archivos)
//Añadir barra de filtros:
//  Ordenar por fecha
//  INPUT TEXT con usuario o tags

//añadir paginacion
//Cambiar icono descarga y compartir