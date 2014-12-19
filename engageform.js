/*
 4screens-engageform v0.1.0
 (c) 2014 Nopattern sp. z o.o.
 License: proprietary
*/
'use strict';

angular.module( '4screens.engageform',[
  '4screens.common',
  '4screens.settings',
  'LocalStorageModule',
  'youtube-embed'
]).config(["localStorageServiceProvider", function( localStorageServiceProvider ) {
  // localStorageService
  localStorageServiceProvider.prefix = '4screens.engageform';
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/main.html',
    '<link rel="stylesheet" type="text/css" data-ng-href="{{ customThemeCssFile || staticThemeCssFile }}" data-ng-if="!!customThemeCssFile || !!staticThemeCssFile"><div id="four-screens-application"><div class="theme-background-image-file  theme-background-color"></div><div class="four-screens__embed-container theme-main-font"><div ng-repeat="question in questions" class=" questionnaire animate-if"><div class="four-screens__content wrapper" data-ng-include="\'views/engageform/question-\' + question.type + \'.html\'" data-ng-if="$index == currentQuestion.index()"></div></div><div class="four-screens__footer"><div class="progress" data-ng-if="currentQuestion.index() > -1"><span class="progress__bar"><span class="progress__bar--line theme-button-color" ng-class="{\'progress__bar--full-size\': (((currentQuestion.index() + 1)  / questions.length )*100) == 100 }" style="width: {{( (currentQuestion.index() + 1)  / questions.length )*100 | number:0 }}%"></span><div class="progress__numbering">({{ currentQuestion.index() + 1 }} z {{ questions.length }})</div></span></div><button class="progress__btn progress__btn--prev theme-button-color theme-question-color" data-ng-show="hasPrev()" data-ng-click="prev()"><span>&laquo; PREV</span></button> <button class="progress__btn progress__btn--next theme-button-color theme-question-color" data-ng-show="hasNext()" data-ng-click="next()"><span>NEXT &raquo;</span></button></div></div></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-infoPage.html',
    '<div class="swiper"><a class="swiper swiper-arrow swiper-arrow__left" data-ng-click="swipePrev()"></a> <a class="swiper swiper-arrow swiper-arrow__right" data-ng-click="swipeNext()"></a><div class="swiper-container engageform-swiper-directive"><div class="swiper-wrapper"><article class="swiper-slide" data-ng-repeat="page in question.infoPages"><h2 class="theme-question-color">{{ page.title }}</h2><figure><div class="wrapper ir-16-10" data-ng-if="!!page.imageFile || !!page.youTubeId"><img data-ng-if="!!page.imageFile" data-ng-src="{{ currentQuestion.answerMedia( page.imageFile ) }}" data-ng-click="goto( page.url )"><div data-ng-if="!!page.youTubeId" data-youtube-video data-video-id="page.youTubeId"></div></div></figure><p class="swiper-slide__description theme-answer-color theme-answer-background-color" data-ng-if="!!page.description" data-ng-bind="page.description" data-ng-click="goto( page.url )"></p></article></div></div><div class="pagination-swiper"></div></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-multiChoice.html',
    '<h2 class="theme-question-color">{{ question.text }}</h2><img data-ng-if="!!currentQuestion.mainMedia()" data-ng-src="{{ currentQuestion.mainMedia().src }}"><div data-ng-click="sendAnswer( answer._id )" data-ng-repeat="answer in question.answers" class="questionnaire__answer" data-ng-class="{\'questionnaire__answer--correct\': questionAnswer.status[ answer._id ].correct, \'questionnaire__answer--wrong\': questionAnswer.status[ answer._id ].wrong, \'questionnaire__answer--selected\': questionAnswer.status[ answer._id ].selected }"><label>{{answer.text}} <span data-ng-if="!!questionAnswer.stats">{{ !!questionAnswer.stats[answer._id] ? (100 * questionAnswer.stats[answer._id]) : 0 | number:1 }} % <span></span></span></label> <span class="questionnaire__precent-bar theme-progress-background-color" data-ng-if="!!questionAnswer.stats" style="width:{{!!questionAnswer.stats[answer._id] ? (100 * questionAnswer.stats[answer._id]) : 0 | number:0}}%"></span></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-pictureChoice.html',
    '<h2 class="theme-question-color">{{ question.text }}</h2><img data-ng-if="!!currentQuestion.mainMedia()" data-ng-src="{{ currentQuestion.mainMedia().src }}"><div ng-repeat="answer in question.answers" class="questionnaire__answer questionnaire__answer--picture-choise" data-ng-class="{\'questionnaire__answer--correct\': answer._id==questionAnswer.correct, \'questionnaire__answer--wrong\': questionAnswer.selected==answer._id && !!questionAnswer.correct, \'questionnaire__answer--selected\': questionAnswer.selected==answer._id && !questionAnswer.correct}" data-ng-click="sendAnswer( answer._id )"><figure><div class="wrapper ir"><img data-ng-src="{{ currentQuestion.answerMedia( answer.imageFile ) }}"></div><figcaption>{{ answer.text }}</figcaption><div class="results" ng-if="!!questionAnswer && !!questionAnswer.stats"><span>{{ !!questionAnswer.stats[answer._id] ? (100 * questionAnswer.stats[answer._id]) : 0 | number:1 }}<span class="precent">%</span> <span></span></span></div></figure></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-rateIt.html',
    '<h2 class="theme-question-color">{{ question.text }}</h2><img data-ng-if="!!currentQuestion.mainMedia()" data-ng-src="{{ currentQuestion.mainMedia().src }}"><div class="list list__rating list_rating--stars"><span ng-click="sendAnswer(5, $event)" ng-class="{\'item__selected\': questionAnswer.selected >= 5}"><i class="fa"></i></span> <span ng-click="sendAnswer(4, $event)" ng-class="{\'item__selected\': questionAnswer.selected >= 4}"><i class="fa"></i></span> <span ng-click="sendAnswer(3, $event)" ng-class="{\'item__selected\': questionAnswer.selected >= 3}"><i class="fa"></i></span> <span ng-click="sendAnswer(2, $event)" ng-class="{\'item__selected\': questionAnswer.selected >= 2}"><i class="fa"></i></span> <span ng-click="sendAnswer(1, $event)" ng-class="{\'item__selected\': questionAnswer.selected >= 1}"><i class="fa"></i></span></div><div class="rating__results theme-question-color" data-ng-if="questionAnswer.average"><span>Średnia: {{ questionAnswer.average | number:1 }}</span></div>');
}]);

'use strict';

angular.module('4screens.engageform').controller( 'engageformDefaultCtrl',
  ["CONFIG", "EngageformBackendService", "$scope", "$routeParams", function( CONFIG, EngageformBackendService, $scope, $routeParams ) {

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
      });
    };

    $scope.prev = function() {
      if( false ) {
        // move prev slide
      }

      EngageformBackendService.navigation.prev();
      $scope.sentAnswer();
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

      EngageformBackendService.navigation.next();
      $scope.sentAnswer();
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
      answerMedia: EngageformBackendService.question.answerMedia
    };
  }]
);

'use strict';

angular.module('4screens.engageform').directive( 'engageformSwiperDirective',
  ["$timeout", "$window", function( $timeout, $window ) {
    return {
      restrict: 'C',
      link: function ( scope ) {
        var instance
          , params = {
              slideElement: 'article',
              slidesPerView: 1,
              pagination: '.pagination-swiper',
              calculateHeight: true,
              roundLengths: true,
              resizeReInit: true
            };

        // This code will run after template has been loaded
        // and transformed by directives
        // and properly rendered by the browser
        $timeout( function() {
          $timeout( function() {
            $timeout( function() {
              $timeout( function() {
                instance = new Swiper( '.engageform-swiper-directive', params );
                scope.swipeNext = instance.swipeNext;
                scope.swipePrev = instance.swipePrev;
                scope.goto = function( url ) {
                  if( !!url ) {
                    $window.open( url );
                  }
                };
              });
            });
          });
        });
      }
    };
  }]
);

'use strict';

angular.module('4screens.engageform').factory( 'EngageformBackendService',
  ["CONFIG", "CommonLocalStorageService", "SettingsEngageformService", "$q", function( CONFIG, CommonLocalStorageService, SettingsEngageformService, $q ) {
    var _quiz
      , _questions
      , _questionIndex = 0
      , _cache = {}
      , USER_IDENTIFIER = 'ui'
      , QUESTION_SENT_ANSWER = 'qsa_';

    _cache[ USER_IDENTIFIER ] = CommonLocalStorageService.get( USER_IDENTIFIER );

    function getMainMediaFromCurrentQuestion() {
      // cache
      _cache.mainMedia = _cache.mainMedia || {};
      if( _cache.mainMedia[ _questions[_questionIndex]._id ] !== undefined ) {
        return _cache.mainMedia[ _questions[_questionIndex]._id ];
      }

      // access to main media?
      _questions[_questionIndex].settings = _questions[_questionIndex].settings || {};
      if( !_questions[_questionIndex].settings.showMainMedia ) {
        _cache.mainMedia[ _questions[_questionIndex]._id ] = null;
        return _cache.mainMedia[ _questions[_questionIndex]._id ];
      }
      
      // contains main media?
      if( !_questions[_questionIndex].imageFile ) {
        _cache.mainMedia[ _questions[_questionIndex]._id ] = null;
        return _cache.mainMedia[ _questions[_questionIndex]._id ];
      }

      _cache.mainMedia[ _questions[_questionIndex]._id ] = {
        '$key': _questions[_questionIndex]._id,
        src: CONFIG.backend.domain.replace( ':subdomain', '' ) + CONFIG.backend.imagesUrl + '/' + _questions[_questionIndex].imageFile
      };
      return _cache.mainMedia[ _questions[_questionIndex]._id ];
    }

    return {
      quiz: {
        get: function( engageFormId ) {
          return SettingsEngageformService.get( engageFormId ).then(function( quiz ) {
            _quiz = quiz;
            return quiz;
          });
        },
        getStaticThemeCssFile: function() {
          _quiz.theme = _quiz.theme || {};
          if( !!_quiz.theme.customThemeCssFile ) {
            return CONFIG.backend.domain.replace( ':subdomain', '' ) + '/uploads/' + _quiz.theme.customThemeCssFile;
          }
          return null;
        }
      },
      question: {
        index: function() {
          return _questionIndex;
        },
        settings: function( name ) {
          _questions[ _questionIndex ].settings = _questions[ _questionIndex ].settings || {};
          return !!_questions[ _questionIndex ].settings[ name ];
        },
        mainMedia: function() {
          return getMainMediaFromCurrentQuestion();
        },
        answers: function() {
          return _questions[ _questionIndex ].answers;
        },
        answerMedia: function( filename ) {
          return CONFIG.backend.domain.replace( ':subdomain', '' ) + CONFIG.backend.imagesUrl + '/' + filename;
        },
        sentAnswer: function() {
          var key = QUESTION_SENT_ANSWER + _questions[ _questionIndex ]._id
            , value;

          value = CommonLocalStorageService.get( key );
          if( !!value ) {
            return value;
          }

          return null;
        },
        sendAnswer: function( value ) {
          var deferred, values = {};
          values.quizQuestionId = _questions[ _questionIndex ]._id;

          if( !!CommonLocalStorageService.get( QUESTION_SENT_ANSWER + values.quizQuestionId ) ) {
            deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
          }
          if( _questions[ _questionIndex ].type === 'rateIt' ) {
            values.rateItValue = parseInt( value );
          }
          if( [ 'pictureChoice', 'multiChoice' ].indexOf( _questions[ _questionIndex ].type ) > -1  ) {
            values.selectedAnswerId = value;
          }
          if( _cache[ USER_IDENTIFIER ] ) {
            values.userIdent = _cache[ USER_IDENTIFIER ];
          }

          return SettingsEngageformService.sendAnswer( values ).then(function( data ) {
            _cache[ USER_IDENTIFIER ] = data.userIdent;
            CommonLocalStorageService.set( USER_IDENTIFIER, _cache[ USER_IDENTIFIER ] );
            if( _questions[ _questionIndex ].type === 'rateIt' ) {
              CommonLocalStorageService.set( QUESTION_SENT_ANSWER + values.quizQuestionId, {
                selected: data.selectedValue,
                average: data.avgRateItValue
              });
            } else if( [ 'pictureChoice', 'multiChoice' ].indexOf( _questions[ _questionIndex ].type ) > -1  ) {
              CommonLocalStorageService.set( QUESTION_SENT_ANSWER + values.quizQuestionId, {
                selected: data.selectedAnswerId,
                correct: data.correctAnswerId,
                stats: data.stats
              });
            }
            return data;
          });
        }
      },
      questions: {
        get: function() {
          return SettingsEngageformService.getQuestions( _quiz._id ).then(function( questions ) {
            _questions = questions;
            return questions;
          });
        }
      },
      navigation: {
        prev: function() {
          if( _questionIndex - 1 >= 0 ) {
            _questionIndex--;
          }
        },
        hasPrev: function() {
          // data-ng-show="currentQuiz.settings.allowQuestionNavigation" ng-if="getPrevQuestionIndex() !== undefined" ng-click="showPrevQuestion()"
          return true;
        },
        next: function() {
          if( _questionIndex + 1 <= _questions.length - 1 ) {
            _questionIndex++;
          }
        },
        hasNext: function() {
          // data-ng-show="currentQuestion.type === 'infoPage' || (currentQuestion.answered && (currentQuestion.settings.showAnswers || currentQuestion.settings.showCorrectAnswer))" ng-if="!!getNextQuestionIndex()"
          return true;
        }
      }
    };
  }]
);
