'use strict';

angular.module('4screens.engageform').controller( 'engageformDefaultCtrl',
  function( CONFIG, EngageformBackendService, CloudinaryService, $scope, $routeParams, $timeout, $window, $http, $q, previewMode, summaryMode ) {
    var nextQuestionTimeout, quizId = $routeParams.engageFormId;

    $scope.pagination = { curr: function() {}, last: 0 };

    EngageformBackendService.quiz.get( quizId ).then(function( quiz ) {
      $scope.quiz = quiz;
      $scope.staticThemeCssFile = EngageformBackendService.quiz.getStaticThemeCssFile();
      EngageformBackendService.questions.get().then(function( questions ) {
        $scope.wayAnimateClass = 'way-animation__next';

        // Get questions
        $scope.questions = _.sortBy( questions, 'position' );

        if ( summaryMode ) {
          _.map($scope.questions, function( question ) {
            if ( !!question.settings && typeof question.settings.showAnswers !== 'undefined') {
              question.settings.showAnswers = true;
            }

            if ( typeof question.requiredAnswer !== 'undefined' ) {
              question.requiredAnswer = false;
            }

            return question;
          });
        }

        // Group questions
        $scope.endPages = _.groupBy( $scope.questions, { type: 'endPage' } ).true || [];
        $scope.startPages = _.groupBy( $scope.questions, { type: 'startPage' } ).true || [];
        $scope.normalQuestions = _.groupBy( $scope.questions, function( e ) { return e.type !== 'endPage' && e.type !== 'startPage'; } ).true || [];

        // Restack question
        $scope.questions = $scope.startPages.length ? new Array($scope.startPages[0]) : [];
        $scope.questions = $scope.questions.concat( $scope.normalQuestions );

        // No normal questions
        if( $scope.normalQuestions.length < 1 ) {

          // If poll or surver and only 1 endPage
          if( ( $scope.quiz.type === 'poll' || $scope.quiz.type === 'survey' ) && $scope.endPages.length === 1 ) {
            $scope.questions.push($scope.endPages[0]);
          }
        }

        // Helper
        $scope.normalQuestionsAmmount = $scope.normalQuestions.length;

        // Pagination
        $scope.pagination = {
          curr: function () {
            return $scope.currentQuestion.index() + ( $scope.startPages.length ? 0 : 1 );
          },
          last: $scope.normalQuestions.length
        };

        // Sync questions
        EngageformBackendService.questions.sync($scope.questions, $scope.currentQuestion.index());

        $scope.sentAnswer();

        // Init socialshare
        $scope.socialShare().init();
      });
    });

    function setScreenType() { $scope.screenType = $window.innerHeight > $window.innerWidth ? 'narrow' : 'wide'; }

    function checkScreenType() {
      if (!$scope.$$phase) {
        $scope.$apply( setScreenType );
      }
    }

    function receiveMessage( event ){
      var results;

      if ( !event.data.length ) {
        return;
      }

      // Ignore fb, twttr messages 
      if ( event.origin.indexOf('facebook') !== -1 || event.origin.indexOf('twitter') !== -1 ) {
        return;
      }

      results = JSON.parse( event.data );
      if ( previewMode ) {
        $scope.$apply(function() {
          EngageformBackendService.setUserResults( results );
        });
      } else if ( summaryMode ) {
        $scope.$apply(function() {
          EngageformBackendService.setAnswersResults( results );
        });
      }
    }

    $window.addEventListener( 'message', receiveMessage, false );

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
      var fzw = Math.min( ww / cfg.maxWidth, 1 ), fzh = Math.min( wh / cfg.maxHeight, 1 ), fz = Math.max( cfg.minFontSize, Math.min( fzw, fzh ) );
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
        paddingBottom: Math.round( _imageData.containerHeight / baseWidth * 100 ),
        src: $scope.questions[$scope.currentQuestion.index()].imageFile
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

    $scope.sendAnswer = function( value, $event, force ) {
      if( $event ) {
        $event.stopPropagation();
        $event.preventDefault();
      }

      if ( summaryMode ) {
        return false;
      }

      return EngageformBackendService.question.sendAnswer( value ).then( function() {
        if( !!$scope.questionAnswer && !$scope.questionAnswer.form ) {
          $scope.sentAnswer();
        }

        if (!$scope.currentQuestion.settings('showAnswers') && !$scope.currentQuestion.settings('showCorrectAnswer') && $scope.hasNext() && !nextQuestionTimeout && $scope.pagination.curr() < $scope.pagination.last) {
          nextQuestionTimeout = $timeout( function () {
            typeof force === 'undefinded' ? $scope.next() : $scope.next( null, true );
            nextQuestionTimeout = null;
          }, 200 );
        }

      });
    };

    $scope.checkUser = function () {
      return EngageformBackendService.user.check();
    };

    $scope.getUser = function() {
      return EngageformBackendService.user.get();
    };

    $scope.pickCorrectEndPage = function( res ) {
      var correctEndPage;
      $scope.wayAnimateClass = '';

      switch( $scope.quiz.type ) {
      case 'score':
        if(res.hasOwnProperty('totalScore') && $scope.endPages.length) {
          correctEndPage = _.filter( $scope.endPages, function( e ) {
            if( e.coverPage && e.coverPage.scoreRange && e.coverPage.scoreRange.min <= res.totalScore / res.maxScore * 100 && e.coverPage.scoreRange.max >= res.totalScore / res.maxScore * 100 ) {
              return e;
            }
          } );

          if(correctEndPage.length) {
            $scope.questions.push( correctEndPage[0] );
            $scope.showScore( Math.ceil( res.totalScore / res.maxScore * 100 ) );
          }
        }
        break;

      case 'outcome':
        if(res.hasOwnProperty('outcome') && $scope.endPages.length) {
          $scope.scoredOutcome = res.outcome;
          correctEndPage = _.filter( $scope.endPages, function( e ) {
            if( e.coverPage && e.coverPage.outcome && e.coverPage.outcome === res.outcome ) {
              return e;
            }
          } );

          if(correctEndPage.length) {
            $scope.questions.push( correctEndPage[0] );
          }
        }
        break;

      default:
        // Only 1 endPage exist
        if($scope.endPages.length) {
          $scope.questions.push($scope.endPages[0]);
        }
        break;
      }

      // Sync backend questions array
      EngageformBackendService.questions.sync($scope.questions, $scope.currentQuestion.index());

      $scope.wayAnimateClass = 'way-animation__next';
    };

    // Check if globalUserIdent exist, otherwise get one
    $scope.checkUser();

    function submitQuizXHR( quizId ) {
      // Check if there is userIdent (user choose at least 1 answer)
      if( !$scope.getUser().uid ) {
        $scope.requiredMessage = 'You need to answer at least one question to finish quiz';
        return false;
      }

      return EngageformBackendService.quiz.submit( quizId )
        .then( function( res ) {
          $scope.pickCorrectEndPage( res );

          if( _.where( $scope.questions, { type: 'endPage' } ).length ) {
            // EngageformBackendService.navigation.next();
            $scope.next( null, true );
          } else {
            $scope.requiredMessage = 'Thank you!';
          }

        } )
        .catch( function ( res ) {
          $scope.requiredMessage = res.data.msg || 'Unexpected error';
        } );
    }

    $scope.submitQuiz = function( $event ) {
      if ( summaryMode ) {
        return false;
      }

      $scope.requiredMessage = '';

      if( !$scope.requiredMessage || ($scope.requiredMessage && $scope.requiredMessage.length < 1) ) {
        $scope.requiredMessage = '';

        if($scope.questions[$scope.currentQuestion.index()].type === 'forms') {
          $scope.questionAnswer.selected = true;
          sendDataForm( $scope.questionAnswer.status, $event ).then(function( r ) {
            submitQuizXHR( quizId );
          });
        } else {
          submitQuizXHR( quizId );
        }
      }
    };

    $scope.showScore = function( s ) {
      $scope.scoredPoints = s;
    };

    $scope.formatAnswers = function ( val ) {
      return !!val ? (100 * val) : 0;
    };

    $scope.formatAnswersTransform = function ( val ) {
      var valueTransform = !!val ? ( val * 100 ) : 0;
      return 'translate(-50%,' + (100 - valueTransform) + '%)';
    };

    $scope.prev = function() {
      EngageformBackendService.navigation.prev();
      $scope.sentAnswer();
      $scope.wayAnimateClass = 'way-animation__prev';
    };
    $scope.hasPrev = function() {
      return EngageformBackendService.navigation.hasPrev();
    };

    $scope.next = function( $event, force ) {

      // Do not valid anything it's a startPage
      if($scope.questions[$scope.currentQuestion.index()].type === 'startPage' || typeof force !== 'undefined') {
        EngageformBackendService.navigation.next();
        $scope.wayAnimateClass = 'way-animation__next';
        $scope.requiredMessage = '';
        $scope.sentAnswer();

      } else if( !previewMode && !summaryMode ) {

        // Is required and selected or is not required
        if( !$scope.questionAnswer.form && ( ($scope.currentQuestion.requiredAnswer() && $scope.questionAnswer.selected) || !$scope.currentQuestion.requiredAnswer()) ) {
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
        // Preview mode
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

    $scope.progressBarWidth = function() {
      return ( ( $scope.pagination.curr() / $scope.pagination.last ) * 100 );
    };

    $scope.socialShare = function() {
      var cq = $scope.questions[$scope.currentQuestion.index()], sso = {};
      sso = {
        enabled: cq.coverPage.showSocialShares ? true : false,
        title: $scope.quiz.settings.share.title || $scope.quiz.title,
        description: $scope.quiz.settings.share.description || 'Fill out this' + $scope.quiz.type + '!',
        imageUrl: $scope.quiz.settings.share.imageUrl ? $scope.currentQuestion.answerMedia( $scope.quiz.settings.share.imageUrl ) : CONFIG.backend.domain + CONFIG.backend.share.defaultImgUrl,
        link: $scope.quiz.settings.share.link || $window.location.href,
        href: $window.location.href,
        init: function() {
          // Init twitter
          if( typeof window.twttr === 'object' ){
            window.twttr.events.bind( 'tweet', function() {
              $http
                .get( CONFIG.backend.answers.domain + CONFIG.backend.share.other.replace( ':service', 'twitter' ).replace( ':quizId', cq.quizId ) )
                .then(function( res ) { console.log( res ); })
                .catch(function( res ) { console.log( res ); })
              ;
            } );
          } else {
            console.error('Twitter api is not included');
          }

          // Init linkedin
          // Broken callback function
          /*window.linkedinShareSuccess = function() {
            return $http
              .get( CONFIG.backend.answers.domain + CONFIG.backend.share.other.replace( ':service', 'linkedin' ).replace( ':quizId', cq.quizId) )
              .then(function( res ) { console.log( res ); })
              .catch(function( res ) { console.log( res ); })
            ;
          };*/
        }
      };
      sso.facebook = {
        share: function() {
          window.open(
            CONFIG.backend.answers.domain + CONFIG.backend.share.facebook + '?quizId=' + cq.quizId + '&description=' + sso.description + '&name=' + sso.title + '&image=' + sso.imageUrl,
            '_blank',
            'toolbar=no,scrollbars=no,resizable=yes,width=460,height=280'
          );
        }
      };
      sso.linkedin = {
        share: function () {
          window.open(
            'https://www.linkedin.com/shareArticle?mini=true&url=' + sso.link + '&title=' + sso.title + '&summary' + sso.description,
            '_blank',
            'toolbar=no,scrollbars=no,resizable=yes,width=550,height=500'
          );
        }
      };

      // Personalyze description for outcomes and score
      if ($scope.quiz.type === 'outcome' || $scope.quiz.type === 'score') {
        sso.description = 'I got :result on :quizname on Engageform! What about you?'.replace( ':quizname', $scope.quiz.title );
        sso.description = sso.description.replace( ':result', $scope.quiz.type === 'score' ? ( $scope.scoredPoints || 0 ) + ' %' : ( $scope.scoredOutcome || '' ) );

        if (cq.type === 'endPage' && cq.imageFile && cq.settings.showMainMedia) {
          sso.imageUrl = $scope.currentQuestion.mainMedia().src;
        }
      }

      return sso;
    };

    function sendDataForm( data, $event ) {
      var inputs = [];

      for( var property in data ) {
        if( data.hasOwnProperty( property ) ) {
          inputs.push( { _id: property, value: data[property] });
        }
      }

      if(!!inputs.length) {
        return $scope.sendAnswer( inputs, $event, true );
      } else {
        if($scope.pagination.curr() >= $scope.pagination.last) {
          var deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        } else {
          $scope.next( null, true );
        }
      }
    }

  }
);
