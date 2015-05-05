'use strict';

angular.module('4screens.engageform').controller( 'engageformDefaultCtrl',
  function( CONFIG, EngageformBackendService, $scope, $routeParams ) {

    EngageformBackendService.quiz.get( $routeParams.engageFormId ).then(function( quiz ) {
      $scope.quiz = quiz;
      $scope.staticThemeCssFile = EngageformBackendService.quiz.getStaticThemeCssFile();
      EngageformBackendService.questions.get().then(function( questions ) {
        $scope.questions = questions;
        $scope.sentAnswer();
      });
    });

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
        $scope.sentAnswer();
        if ($scope.hasNext()) {
          $scope.next();
        }
      });
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
