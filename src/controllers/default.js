'use strict';

angular.module('4screens.engageform').controller( 'engageformDefaultCtrl',
  function( CONFIG, EngageformBackendService, CloudinaryService, $scope, $routeParams, $timeout, $window, previewMode ) {
    var nextQuestionTimeout
      , quizId = $routeParams.engageFormId;

    EngageformBackendService.quiz.get( quizId ).then(function( quiz ) {
      $scope.quiz = quiz;
      $scope.staticThemeCssFile = EngageformBackendService.quiz.getStaticThemeCssFile();
      EngageformBackendService.questions.get().then(function( questions ) {
        $scope.wayAnimateClass = 'way-animation__next';
        $scope.questions = _.sortBy( questions, 'position' );
        $scope.sentAnswer();

        $scope.normalQuestionsAmmount = $scope.questions.length - (_.where( $scope.questions, { type: 'startPage' } ).length || 0) - (_.where( $scope.questions, { type: 'endPage' } ).length || 0);
      });
    });

    function setScreenType() { $scope.screenType = $window.innerHeight > $window.innerWidth ? 'narrow' : 'wide'; }

    function checkScreenType() {
      if (!$scope.$$phase) {
        $scope.$apply( setScreenType );
      }
    }

    function receiveMessage(event){
      var results = JSON.parse(event.data);
      EngageformBackendService.setUserResults(results);
    }

    var a = {
      data: '"{"account":"5446210ac07487952e8bf773","finished":true,"globalUserIdent":"62473bc9-b060-453d-8ef4-8782fd2cdbc4","id":"5552139df9dfb10100116269-85c5af94-ee6c-424e-bbd0-cdab0b66819b","lastUpdated":"2015-05-29T10:29:12.151Z","questions":{"5554b51dbdf9420100873ee9":{"account":"5446210ac07487952e8bf773","inputs":[],"points":1,"quizId":"5552139df9dfb10100116269","quizQuestionId":"5554b51dbdf9420100873ee9","selectedAnswerId":"55645b0d2ad8d20100d78374","time":"2015-05-29T10:29:09.167Z","userIdent":"85c5af94-ee6c-424e-bbd0-cdab0b66819b"},"55645b142ad8d20100d78376":{"account":"5446210ac07487952e8bf773","inputs":[],"points":0,"quizId":"5552139df9dfb10100116269","quizQuestionId":"55645b142ad8d20100d78376","rateItValue":5,"time":"2015-05-29T10:29:10.760Z","userIdent":"85c5af94-ee6c-424e-bbd0-cdab0b66819b"},"55648a8490310d0100ab5bb6":{"account":"5446210ac07487952e8bf773","inputs":[],"points":0,"quizId":"5552139df9dfb10100116269","quizQuestionId":"55648a8490310d0100ab5bb6","selectedAnswerId":"55648a9290310d0100ab5bbb","time":"2015-05-29T10:29:12.148Z","userIdent":"85c5af94-ee6c-424e-bbd0-cdab0b66819b"}},"quizId":"5552139df9dfb10100116269","userIdent":"85c5af94-ee6c-424e-bbd0-cdab0b66819b","$$hashKey":"object:135"}"'
    };

    receiveMessage(a);

    $window.addEventListener('message', receiveMessage, false);

    $scope.makeTimes = function ( s ) {
      var a = [];
      for ( var i = 0; i < s; i++ ) {
        a.push( i );
      }
      return a;
    };

    $scope.scaleEmbedCfg = {
      minFontSize: 0.7,
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
    };

    $scope.getImgUrl = function ( src, w, dpr, blur ) {
      return CloudinaryService.getImgUrl( src, w, dpr, blur );
    };

    $scope.getMainImgUrl = function ( src, w, dpr ) {
      var trs = $scope.questions[$scope.currentQuestion.index()].imageData
        , baseWidth = parseInt( CONFIG.backend.mainImageContainerBaseWidth, 10 ) || 540;

      return !trs ? CloudinaryService.getImgUrl( src, w, dpr ) : CloudinaryService.getMainImgUrl(
        src,
        w * ( trs.width / 100 || 1 ),
        w,
        Math.round( trs.containerHeight * ( w / baseWidth ) ),
        Math.round( ( w / baseWidth ) * Math.round( baseWidth * trs.left * -1 / 100 ) || 0 ),
        Math.round( ( w / baseWidth ) * Math.round( trs.containerHeight * trs.top * -1 / 100 ) || 0 )
      );
    };

    $scope.mainMediaImg = function() {
      var _imageData = $scope.questions[$scope.currentQuestion.index()].imageData
        , _width
        , baseWidth = parseInt( CONFIG.backend.mainImageContainerBaseWidth, 10 ) || 540;

      if ( !$scope.questions[$scope.currentQuestion.index()].imageData ) {
        return null;
      }

      if ( _imageData.width < 100 ) {
        if ( _imageData.left + _imageData.width > 100 ) {
          _width = 100 - _imageData.left;
        } else {
          _width = _imageData.width + Math.min( _imageData.left, 0 );
        }
      } else {
        _width = 100;
      }
      return {
        width: _width,
        paddingBottom: Math.round( _imageData.containerHeight / baseWidth * 100 )
      };
    };

    $scope.sentAnswer = function() {
      $scope.questionAnswer = EngageformBackendService.question.sentAnswer() || {};
      $scope.questionAnswer.status = $scope.questionAnswer.status || {};

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

      EngageformBackendService.question.sendAnswer( value ).then( function() {
        if( !!$scope.questionAnswer && !$scope.questionAnswer.form ) {
          $scope.sentAnswer();
        }

        if ($scope.hasNext() && !nextQuestionTimeout) {
          nextQuestionTimeout = $timeout( function () {
            $scope.next();
            nextQuestionTimeout = null;
          }, 200 );
        }

      });
    };

    $scope.checkUser = function () {
      return EngageformBackendService.user.check();
    };
    // Check if globalUserIdent exist, otherwise get one
    $scope.checkUser();

    $scope.submitQuiz = function() {
      return EngageformBackendService.quiz.submit( quizId ).then( function () {
      } ).then( function() {
        // No res here
        // Todo: show EndPage
        $scope.next();
      } ).catch( function ( res ) {
        $scope.requiredMessage = res.data.msg || 'Unexpected error';
      } );
    };

    $scope.formatAnswers = function ( val ) {
      return !!val ? (100 * val) : 0;
    };

    $scope.prev = function() {
      EngageformBackendService.navigation.prev();
      $scope.sentAnswer();
      $scope.wayAnimateClass = 'way-animation__prev';
    };
    $scope.hasPrev = function() {
      return EngageformBackendService.navigation.hasPrev();
    };
    $scope.next = function( $event ) {
      if( $scope.currentQuestion.requiredAnswer() && !previewMode ) {
        if( $scope.questionAnswer.selected ) {
          EngageformBackendService.navigation.next();
          $scope.sentAnswer();
          $scope.wayAnimateClass = 'way-animation__next';
          $scope.requiredMessage = '';
        } else if( $scope.questionAnswer && $scope.questionAnswer.form && $scope.questionAnswer.form.$valid ) {
          $scope.questionAnswer.selected = true;
          sendDataForm( $scope.questionAnswer.status, $event );
        } else {
          $scope.requiredMessage = 'Answer is required to proceed to next question';
        }
      } else {
        EngageformBackendService.navigation.next();
        $scope.sentAnswer();

        $scope.wayAnimateClass = 'way-animation__next';
      }
    };

    $scope.hasNext = function() {
      return EngageformBackendService.navigation.hasNext();
    };

    $scope.currentQuestion = {
      index: EngageformBackendService.question.index,
      settings: EngageformBackendService.question.settings,
      mainMedia: EngageformBackendService.question.mainMedia,
      answers: EngageformBackendService.question.answers,
      inputs: EngageformBackendService.question.inputs,
      answerMedia: EngageformBackendService.question.answerMedia,
      requiredAnswer: EngageformBackendService.question.requiredAnswer
    };

    function sendDataForm( data, $event ) {
      var inputs = [];

      for( var property in data ) {
        if( data.hasOwnProperty( property ) ) {
          inputs.push( { _id: property, value: data[property] });
        }
      }

      if(!!inputs.length) {
        $scope.sendAnswer( inputs, $event );
      }
    }

  }
);
