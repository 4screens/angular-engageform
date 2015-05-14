'use strict';

angular.module('4screens.engageform').controller( 'engageformDefaultCtrl',
  function( CONFIG, EngageformBackendService, CloudinaryService, $scope, $routeParams, $timeout, $window ) {
    var quizId = $routeParams.engageFormId;

    EngageformBackendService.quiz.get( quizId ).then(function( quiz ) {
      $scope.quiz = quiz;
      $scope.staticThemeCssFile = EngageformBackendService.quiz.getStaticThemeCssFile();
      EngageformBackendService.questions.get().then(function( questions ) {
        $scope.questions = _.sortBy( questions, 'position' );
        $scope.sentAnswer();
      });
    });

    function setScreenType() { $scope.screenType = $window.innerHeight > $window.innerWidth ? 'narrow' : 'wide'; }

    function checkScreenType() {
      if (!$scope.$$phase) {
        $scope.$apply( setScreenType );
      }
    };

    $scope.scaleEmbedCfg = {
      minFontSize: .7,
      maxWidth: 680,
      maxHeight: 880
    };

    function scaleEmbed ( cfg, ww, wh ) {
      var fzw = Math.min( ww / cfg.maxWidth, 1 )
        , fzh = Math.min( wh / cfg.maxHeight, 1 ) 
        , fz = Math.max( cfg.minFontSize, Math.min( fzw, fzh ) );
      angular.element($window.document.querySelector('html')).css( 'font-size', Math.floor( fz * 1000 ) / 10 + '%' );
    }

    angular.element( $window ).bind( 'resize', function () {
      checkScreenType();
      scaleEmbed( $scope.scaleEmbedCfg, $window.innerWidth, $window.innerHeight );
    } );

    setScreenType();
    scaleEmbed( $scope.scaleEmbedCfg, $window.innerWidth, $window.innerHeight );

    $scope.getBgImgUrl = function ( src, w, dpr, blur ) {
      return CloudinaryService.getImgUrl( CONFIG.backend.domain.replace( ':subdomain', '' ) + '/uploads/' + src, w, dpr, blur );
    }
    $scope.getImgUrl = function ( src, w, dpr, blur ) {
      return CloudinaryService.getImgUrl( src, w, dpr, blur );
    }

    $scope.getMainImgUrl = function ( src, w, dpr ) {
      var trs = $scope.questions[$scope.currentQuestion.index()].imageData
        , baseWidth = 620;
      return !trs ? CloudinaryService.getImgUrl( src, w, dpr ) : CloudinaryService.getMainImgUrl( src, w * ( trs.width / 100 || 1 ), baseWidth, trs.containerHeight, Math.round( baseWidth * trs.left * -1 / 100 ) || 0, Math.round( trs.containerHeight * trs.top * -1 / 100 ) || 0 );
    }

    $scope.sentAnswer = function() {
      $scope.questionAnswer = EngageformBackendService.question.sentAnswer() || {};

      $scope.questionAnswer.status = {};
      _.forEach( $scope.currentQuestion.answers(), function( value ) {
        $scope.questionAnswer.status[ value._id ] = {};
        if( value._id === $scope.questionAnswer.selected ) {
          $scope.questionAnswer.status[ value._id ].selected = true;
        }
        if( !!$scope.questionAnswer.correct ) {
          if( value._id === $scope.questionAnswer.correct ) {
            $scope.questionAnswer.status[ value._id ].correct = true;
          } else if( value._id === $scope.questionAnswer.selected ) {
            $scope.questionAnswer.status[ value._id ].wrong = true;
          }
        }
      });
    };

    $scope.sendAnswer = function( value, $event ) {
      if( $event ) {
        $event.stopPropagation();
        $event.preventDefault();
      }

      EngageformBackendService.question.sendAnswer( value ).then(function() {
        if ($scope.hasNext()) {
          $timeout( function () {
            $scope.next();
          }, 2000 );
        }
        $scope.sentAnswer();
      });
    };

    $scope.submitQuiz = function() {
      return EngageformBackendService.quiz.submit( quizId );
    };

    $scope.formatAnswers = function ( val ) {
      return !!val ? (100 * val) : 0;
    };

    $scope.prev = function() {
      if( false ) {
        // move prev slide
      }
      $scope.staticThemeCssFile = EngageformBackendService.quiz.getStaticThemeCssFile();
      EngageformBackendService.navigation.prev();
      $scope.sentAnswer();
      $scope.wayAnimateClass = 'way-animation__prev';
    };
    $scope.hasPrev = function() {
      if( false ) {
        // move next slide
      }

      return EngageformBackendService.navigation.hasPrev();
    };
    $scope.next = function() {
      if( false ) {
        // move next slide
      }
      
      sendDataForm( $scope.currentQuestion.inputs() );
      $scope.staticThemeCssFile = EngageformBackendService.quiz.getStaticThemeCssFile();
      EngageformBackendService.navigation.next();
      $scope.sentAnswer();
      $scope.wayAnimateClass = 'way-animation__next';
    };

    $scope.hasNext = function() {
      if( false ) {
        // move next slide
      }

      return EngageformBackendService.navigation.hasNext();
    };

    $scope.currentQuestion = {
      index: EngageformBackendService.question.index,
      settings: EngageformBackendService.question.settings,
      mainMedia: EngageformBackendService.question.mainMedia,
      answers: EngageformBackendService.question.answers,
      inputs: EngageformBackendService.question.inputs,
      answerMedia: EngageformBackendService.question.answerMedia
    };

    function sendDataForm( data ) {
      var inputs = [];
      
      for( var property in data ) {
        if( data.hasOwnProperty( property ) ) {
          inputs.push( { _id: property, value: data[property] });
        }
      }
      
      if(!!inputs.length) {
        $scope.sendAnswer( inputs );
      }
    }
  }
); 
