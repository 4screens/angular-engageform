'use strict';

angular.module('4screens.engageform').factory( 'EngageformBackendService',
  function( CONFIG, CommonLocalStorageService, SettingsEngageformService, $q ) {
    var _quiz
      , _questions
      , _questionIndex = 0
      , _cache = {}
      , USER_IDENTIFIER = 'ui'
      , QUESTION_SENT_ANSWER = 'qsa_'
      , hashTime = new Date().getTime();

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
            return CONFIG.backend.domain.replace( ':subdomain', '' ) + '/uploads/' + _quiz.theme.customThemeCssFile + '?' + hashTime;
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
        inputs: function() {
          _questions[ _questionIndex ].inputs = _questions[ _questionIndex ].inputs || {};
          return _questions[ _questionIndex ].inputs;
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

          if( _questions[ _questionIndex ].type === 'forms' ) {
            values.inputs = value;
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
            } else if ( _questions[ _questionIndex ].type === 'forms' ) {
                CommonLocalStorageService.set( QUESTION_SENT_ANSWER + values.quizQuestionId, {
                inputs: values.inputs
              });
            }

            return data;
          });
        }
      },
      questions: {
        get: function() {
          return SettingsEngageformService.getQuestions( _quiz._id ).then(function( questions ) {
            _questions = _.sortBy( questions, 'position' );
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
  }
);
