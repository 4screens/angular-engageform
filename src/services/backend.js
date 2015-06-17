'use strict';

angular.module('4screens.engageform').factory( 'EngageformBackendService',
  function( CONFIG, CommonLocalStorageService, SettingsEngageformService, $q, $filter ) {
    var _quiz
      , _questions = []
      , _normalQuestionsAmmount
      , _questionIndex = 0
      , _cache = {}
      , _userResults = null
      , _answerResults = null
      , USER_IDENTIFIER = 'ui'
      , USER_IDENTIFIER_GLOBAL = 'uig'
      , QUESTION_SENT_ANSWER = 'qsa_'
      , hashTime = new Date().getTime();

    _cache[ USER_IDENTIFIER ] = CommonLocalStorageService.get( USER_IDENTIFIER );
    _cache[ USER_IDENTIFIER_GLOBAL ] = CommonLocalStorageService.get( USER_IDENTIFIER_GLOBAL );

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
        src: _questions[_questionIndex].imageFile.slice( 0, 4 ) !== 'http' ? CONFIG.backend.domain.replace( ':subdomain', '' ) + CONFIG.backend.imagesUrl + '/' + _questions[_questionIndex].imageFile : _questions[_questionIndex].imageFile
      };
      return _cache.mainMedia[ _questions[_questionIndex]._id ];
    }

    function _formAnswerResult( id ) {
      var index;

      index = _.findIndex( _answerResults, function( answer ) {
        return answer.stats.questionId === id;
      } );

      if (index < 0) {
        return;
      }

      return _answerResults[index];
    }

    function _formUserResult( id ) {
      var answer = _userResults.questions && _userResults.questions[id] ? _userResults.questions[id] : _userResults[id],
          question = _questions[ _questionIndex ],
          result = null;

      if ( !answer ) {
        return result;
      }

      switch(question.type) {
      case 'multiChoice':
        if (!!answer.selectedAnswerId) {
          result = {
            selected: answer.selectedAnswerId
          };
        }
        break;
      case 'pictureChoice':
        if (!!answer.selectedAnswerId) {
          result = {
            selected: answer.selectedAnswerId
          };
        }
        break;
      case 'rateIt':
        if (!!answer.rateItValue) {
          result = {
            selected: answer.rateItValue
          };
        }
        break;
      case 'forms':
        if (!!answer.inputs.length) {
          result = {
            status: {}
          };

          for (var input in answer.inputs) {
            result.status[answer.inputs[input]._id] = answer.inputs[input].value;
          }
        }
        break;
      default:
        break;
      }

      return result;
    }

    return {
      preview: {
        setUserResults: function( results ){
          var deferred = $q.defer();

          _userResults = results ? results : null;

          deferred.resolve();

          return deferred.promise;
        },
        setAnswersResults: function( results ){
          var deferred = $q.defer();

          _answerResults = results ? results : null;

          deferred.resolve();

          return deferred.promise;
        },
        getUserResults: function() {
          return _userResults;
        }
      },
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
        },
        submit: function( engageFormId ) {
          return SettingsEngageformService.submitQuiz( engageFormId, _cache[ USER_IDENTIFIER ], _cache[ USER_IDENTIFIER_GLOBAL ] ).then(function( res ) {

            // Clear LS and _cache
            CommonLocalStorageService.clearAll();
            CommonLocalStorageService.set( USER_IDENTIFIER_GLOBAL, _cache[ USER_IDENTIFIER_GLOBAL ] );

            _cache = {};
            _cache[ USER_IDENTIFIER_GLOBAL ] = CommonLocalStorageService.get( USER_IDENTIFIER_GLOBAL );

            if(_userResults) {
              res.outcome = _userResults.outcome;
              res.totalScore = _userResults.totalScore;
              res.maxScore = _userResults.maxScore;
            }

            return res;
          });
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
          _questions[ _questionIndex ].forms = _questions[ _questionIndex ].forms || {};
          return _questions[ _questionIndex ].forms.inputs;
        },
        answers: function() {
          return _questions[ _questionIndex ] ? _questions[ _questionIndex ].answers : [];
        },
        requiredAnswer: function() {
          return _questions[ _questionIndex ].requiredAnswer;
        },
        answerMedia: function( filename ) {
          return filename.slice( 0, 4 ) !== 'http' ? CONFIG.backend.domain.replace( ':subdomain', '' ) + CONFIG.backend.imagesUrl + '/' + filename : filename;
        },
        sentAnswer: function() {
          var value, id;

          if ( _questions[ _questionIndex ] ) {
            id = _questions[ _questionIndex ]._id;
          } else {
            return null;
          }

          if ( _userResults ) {
            value = _formUserResult( id );
          }
          else if ( _answerResults ) {
            value = _formAnswerResult( id );
          }
          else {
            var key = QUESTION_SENT_ANSWER + id;

            value = CommonLocalStorageService.get( key );
          }

          if( !!value ) {
            return value;
          }

          return null;
        },
        sendAnswer: function( value ) {
          var deferred, values = {};
          values.quizQuestionId = _questions[ _questionIndex ]._id;

          // If the question is already answered and the quiz's settings don't allow changing it, don't go any further.
          if( !_quiz.settings.allowAnswerChange && !!CommonLocalStorageService.get( QUESTION_SENT_ANSWER + values.quizQuestionId ) ) {
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
              var status = {};
              _.forEach( values.inputs, function( input ) {
                selected: true,
                status[ input._id ] = input.value;
              });
              CommonLocalStorageService.set( QUESTION_SENT_ANSWER + values.quizQuestionId, {
                status: status
              });
            }

            return data;
          });
        }
      },
      questions: {
        get: function() {
          return SettingsEngageformService.getQuestions( _quiz._id ).then(function( questions ) {
            _questions = $filter('questionsFilter')( _.sortBy( questions, 'position' ));
            _normalQuestionsAmmount = _questions.length - (_.where( _questions, { type: 'startPage' } ).length || 0) - (_.where( _questions, { type: 'endPage' } ).length || 0);
            return questions;
          });
        },
        sync: function( qa, qi ) {
          _questions = qa;
          _questionIndex = qi;
        }
      },
      navigation: {
        prev: function() {
          if( this.hasPrev() ) {
            _questionIndex--;
          }
        },
        hasPrev: function() {
          // data-ng-show="currentQuiz.settings.allowQuestionNavigation" ng-if="getPrevQuestionIndex() !== undefined" ng-click="showPrevQuestion()"
          return _questionIndex > 0;
        },
        next: function() {
          if( this.hasNext() ) {
            _questionIndex++;
          }
        },
        hasNext: function() {
          // data-ng-show="currentQuestion.type === 'infoPage' || (currentQuestion.answered && (currentQuestion.settings.showAnswers || currentQuestion.settings.showCorrectAnswer))" ng-if="!!getNextQuestionIndex()"
          // return _questionIndex < _questions.length - 1;
          return _questionIndex < _questions.length - 1; //couse of 1endPage
        }
      },
      user: {
        check: function() {
          if ( !_cache[ USER_IDENTIFIER_GLOBAL ]) {
            SettingsEngageformService.getGlobalUserIndent().then(function( res ) {
              _cache[ USER_IDENTIFIER_GLOBAL ] = res;
              CommonLocalStorageService.set( USER_IDENTIFIER_GLOBAL, _cache[ USER_IDENTIFIER_GLOBAL ] );

              return _cache[ USER_IDENTIFIER_GLOBAL ];
            });
          }
        },
        get: function() {
          return {
            uid: _cache[ USER_IDENTIFIER ],
            guid: _cache[ USER_IDENTIFIER_GLOBAL ]
          };
        }
      }
    };
  }
);
