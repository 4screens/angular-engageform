/*
 4screens-engageform v0.1.6
 (c) 2014 Nopattern sp. z o.o.
 License: proprietary
*/
'use strict';

angular.module( '4screens.engageform',[
  '4screens.common',
  '4screens.settings',
  'LocalStorageModule',
  'youtube-embed',
  'ngMessages'
]).config(["localStorageServiceProvider", function( localStorageServiceProvider ) {
  // localStorageService
  localStorageServiceProvider.prefix = '4screens.engageform';
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/main.html',
    '<link rel="stylesheet" type="text/css" data-ng-href="{{ customThemeCssFile || staticThemeCssFile }}" data-ng-if="!!customThemeCssFile || !!staticThemeCssFile"><div id="four-screens-application" class="{{screenType}}"><div class="theme-background-image-file-wrapper theme-background-brightness theme-background-color"><picture data-ng-if="quiz.theme.backgroundImageFile" class="position-{{quiz.theme.backgroundImagePosition}}"><source media="(min-width: 1021px)" data-ng-srcset="{{ getBgImgUrl( quiz.theme.backgroundImageFile, 1920, \'1.0\', quiz.theme.backgroundImageBlur ) }}, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 1920, \'1.5\', quiz.theme.backgroundImageBlur ) }} 1.5x, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 1920, \'2.0\', quiz.theme.backgroundImageBlur ) }} 2.0x"><source media="(min-width: 769px)" data-ng-srcset="{{ getBgImgUrl( quiz.theme.backgroundImageFile, 1020, \'1.0\', quiz.theme.backgroundImageBlur ) }}, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 1020, \'1.5\', quiz.theme.backgroundImageBlur ) }} 1.5x, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 1020, \'2.0\', quiz.theme.backgroundImageBlur ) }} 2.0x"><source media="(min-width: 481px)" data-ng-srcset="{{ getBgImgUrl( quiz.theme.backgroundImageFile, 768, \'1.0\', quiz.theme.backgroundImageBlur ) }}, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 768, \'1.5\', quiz.theme.backgroundImageBlur ) }} 1.5x, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 768, \'2.0\', quiz.theme.backgroundImageBlur ) }} 2.0x"><source media="(min-width: 0px)" data-ng-srcset="{{ getBgImgUrl( quiz.theme.backgroundImageFile, 480, \'1.0\', quiz.theme.backgroundImageBlur ) }}, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 480, \'1.5\', quiz.theme.backgroundImageBlur ) }} 1.5x, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 480, \'2.0\', quiz.theme.backgroundImageBlur ) }} 2.0x"><img data-ng-src="{{ getBgImgUrl( quiz.theme.backgroundImageFile, 1920, \'1.0\', quiz.theme.backgroundImageBlur ) }}" data-ng-srcset="{{ getBgImgUrl( quiz.theme.backgroundImageFile, 1920, \'1.0\', quiz.theme.backgroundImageBlur ) }}, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 1920, \'1.5\', quiz.theme.backgroundImageBlur ) }} 1.5x, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 1920, \'2.0\', quiz.theme.backgroundImageBlur ) }} 2.0x"></picture></div><div class="four-screens__embed-container theme-main-font" data-ng-class="wayAnimateClass"><div data-ng-repeat="question in questions | questionsFilter" class="questionnaire animate-if" data-ng-if="$index == currentQuestion.index()"><div class="question-content-wrapper question-content-wrapper--{{question.type}}"><div class="four-screens__content wrapper" data-ng-class="{ \'content__type--forms\': question.type == \'forms\', \'content__type--info-page\': question.type == \'infoPage\' , \'content__type--multi-choice\': question.type == \'multiChoice\', \'content__type--picture-choice\': question.type == \'pictureChoice\', \'content__type--rate-it\': question.type == \'rateIt\', \'content__type--start-page\': question.type == \'startPage\', \'content__type--end-page\': question.type == \'endPage\' }" data-ng-include="\'views/engageform/question-\' + question.type + \'.html\'"></div></div></div><div class="message-box message-box__require theme-button-color theme-question-color" data-ng-class="{\'is-active\': !!requiredMessage }">{{requiredMessage}}</div><div class="four-screens__footer" data-ng-if="questions[currentQuestion.index()].type !== \'startPage\' && questions[currentQuestion.index()].type !== \'endPage\'"><div class="progress" data-ng-if="currentQuestion.index() > -1"><span class="progress__bar"><span class="progress__bar--line theme-button-color" data-ng-class="{\'progress__bar--full-size\': ((currentQuestion.index() / normalQuestionsAmmount )*100) == 100 }" style="width: {{( currentQuestion.index() / normalQuestionsAmmount )*100 | number:0 }}%"></span></span></div><div class="progress__numbering">({{ currentQuestion.index() }} of {{ normalQuestionsAmmount }})</div><a title="4Screens" href="http://4screens.net/" class="four-screens__footer-logo" target="_blank">4Screens</a></div><div class="four-screens__footer" data-ng-if="questions[currentQuestion.index()].type !== \'startPage\' && questions[currentQuestion.index()].type !== \'endPage\'"><div class="progress" data-ng-if="currentQuestion.index() > -1"><span class="progress__bar"><span class="progress__bar--line theme-button-color" data-ng-class="{\'progress__bar--full-size\': ((currentQuestion.index() / normalQuestionsAmmount )*100) == 100 }" style="width: {{( currentQuestion.index() / normalQuestionsAmmount )*100 | number:0 }}%"></span></span></div><div class="progress__numbering">({{ currentQuestion.index() }} of {{ normalQuestionsAmmount }})</div><a title="4Screens" href="http://4screens.net/" class="four-screens__footer-logo" target="_blank">4Screens</a> <button class="progress__btn progress__btn--prev" data-ng-show="hasPrev()" data-ng-click="prev()"><span><i class="fa fa-chevron-left"></i></span></button> <button class="progress__btn progress__btn--next theme-button-color theme-question-color" data-ng-show="hasNext() && currentQuestion.index() < normalQuestionsAmmount" data-ng-click="next($event)"><span>NEXT <i class="fa fa-chevron-right"></i></span></button> <button class="progress__btn progress__btn--next theme-button-color theme-question-color" data-ng-show="currentQuestion.index() === normalQuestionsAmmount" data-ng-click="submitQuiz()"><span>SUBMIT</span></button></div></div></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-endPage.html',
    '<h2 class="theme-question-color text-center" data-ng-bind-html="question.text | nl2br" data-ng-if="!!question.text"></h2><div class="main-content-description theme-question-color text-center" data-ng-if="!!question.description"><p>{{question.description}}</p></div><picture class="main-media-image" data-ng-if="!!currentQuestion.mainMedia() && !!mainMediaImg()" data-ng-class="{\'no-transform\': !question.imageData, \'transform\': question.imageData}" data-ng-style="{\'padding-bottom\': mainMediaImg().paddingBottom + \'%\'}"><img data-ng-style="{ \'width\': mainMediaImg().width + \'%\', \'left\' : (question.imageData.left > 0 ? question.imageData.left : 0) + \'%\', \'top\' : (question.imageData.top > 0 ? question.imageData.top : 0) + \'%\' }" data-ng-src="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}" data-ng-srcset="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.5\' ) }} 1.5x, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'2.0\' ) }} 2.0x"></picture><div class="text-center main-footer"><a class="btn btn--round-corner btn--normal theme-button-color theme-question-color" rel="nofollow" target="_blank" title="{{question.coverPage.buttonText}}" data-ng-href="{{question.coverPage.link}}">{{question.coverPage.buttonText}}</a></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-forms.html',
    '<h2 class="theme-question-color text-left" data-ng-bind-html="question.text | nl2br" data-ng-if="!!question.text"></h2><picture class="main-media-image" data-ng-if="!!currentQuestion.mainMedia() && !!mainMediaImg()" data-ng-class="{\'no-transform\': !question.imageData, \'transform\': question.imageData}" data-ng-style="{\'padding-bottom\': mainMediaImg().paddingBottom + \'%\'}"><img data-ng-style="{ \'width\': mainMediaImg().width + \'%\', \'left\' : (question.imageData.left > 0 ? question.imageData.left : 0) + \'%\', \'top\' : (question.imageData.top > 0 ? question.imageData.top : 0) + \'%\' }" data-ng-src="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}" data-ng-srcset="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.5\' ) }} 1.5x, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'2.0\' ) }} 2.0x"></picture><form action name="form" class="form" formnovalidate=""><fieldset><div class="form__field" data-ng-repeat="input in question.forms.inputs"><label for="{{input._id}}" data-ng-bind="input.label"></label> <input type="email" placeholder="{{input.label}}" name="{{input._id}}" data-ng-if="input.type==\'email\'" data-ng-model="questionAnswer.status[input._id]" formnovalidate="" ng-required="!!currentQuestion.requiredAnswer"> <input type="text" placeholder="{{input.label}}" name="{{input._id}}" data-ng-if="input.type==\'text\'" data-ng-model="questionAnswer.status[input._id]" formnovalidate="" ng-required="!!currentQuestion.requiredAnswer"> <input type="tel" placeholder="{{input.label}}" name="{{input._id}}" data-ng-if="input.type==\'phone\'" data-ng-model="questionAnswer.status[input._id]" formnovalidate="" ng-required="!!currentQuestion.requiredAnswer"> <input type="url" placeholder="{{input.label}}" name="{{input._id}}" data-ng-if="input.type==\'url\'" data-ng-model="questionAnswer.status[input._id]" formnovalidate="" ng-required="!!currentQuestion.requiredAnswer"> <textarea name="{{input._id}}" id cols="30" rows="10" data-ng-if="input.type==\'textarea\'" placeholder="{{input.label}}" data-ng-model="questionAnswer.status[input._id]" formnovalidate="" ng-required="!!currentQuestion.requiredAnswer"></textarea><div data-ng-messages="form[input._id].$error" data-ng-messages-multiple class="message text-right" data-ng-class="{\'is-active\': !!form[input._id].$error.email || !!form[input._id].$error.url}"><div data-ng-message="email">Your field has an invalid email address</div><div data-ng-message="number">Only numbers</div><div data-ng-message="url">Your field has a invalid url address</div></div></div><input type="text" class="hidden" name="form" data-ng-model="questionAnswer.form" data-ng-init="questionAnswer.form=form"></fieldset><div class="hint"><i class="fa fa-info-circle"></i>&nbsp;<span>Type your answer above. Press next to continue.</span></div></form>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-infoPage.html',
    '<div class="swiper"><a class="swiper swiper-arrow swiper-arrow__left" data-ng-click="swipePrev()"></a> <a class="swiper swiper-arrow swiper-arrow__right" data-ng-click="swipeNext()"></a><div class="swiper-container engageform-swiper-directive"><div class="swiper-wrapper"><article class="swiper-slide" data-ng-repeat="page in question.infoPages"><a data-ng-href="{{ page.url }}" target="_blank" data-ng-class="{\'disabled\': !page.url}"><h2 class="theme-question-color" data-ng-bind-html="page.title | nl2br"></h2><figure><div class="wrapper ir-16-10" data-ng-if="(!!page.imageFile && !!mainMediaImg()) || !!page.youTubeId"><picture class="main-media-image" data-ng-class="{\'no-transform\': !question.imageData, \'transform\': question.imageData}" data-ng-style="{\'padding-bottom\': mainMediaImg().paddingBottom + \'%\'}" data-ng-if="!!page.imageFile && !!mainMediaImg()"><img data-ng-style="{ \'width\': mainMediaImg().width + \'%\', \'left\' : (question.imageData.left > 0 ? question.imageData.left : 0) + \'%\', \'top\' : (question.imageData.top > 0 ? question.imageData.top : 0) + \'%\' }" data-ng-src="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}" data-ng-srcset="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.5\' ) }} 1.5x, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'2.0\' ) }} 2.0x"></picture><div data-ng-if="!!page.youTubeId" data-youtube-video data-video-id="page.youTubeId"></div></div></figure><p class="swiper-slide__description theme-answer-color theme-answer-background-color" data-ng-if="!!page.description" data-ng-bind-html="page.description | nl2br"></p></a></article></div></div><div class="pagination-swiper"></div></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-multiChoice.html',
    '<h2 class="theme-question-color text-left" data-ng-bind-html="question.text | nl2br" data-ng-if="!!question.text"></h2><div class="header__wrapper" data-ng-if="!!currentQuestion.mainMedia() && !!mainMediaImg()"><picture class="main-media-image" data-ng-class="{\'no-transform\': !question.imageData, \'transform\': question.imageData}" data-ng-style="{\'padding-bottom\': mainMediaImg().paddingBottom + \'%\'}"><img data-ng-style="{ \'width\': mainMediaImg().width + \'%\', \'left\' : (question.imageData.left > 0 ? question.imageData.left : 0) + \'%\', \'top\' : (question.imageData.top > 0 ? question.imageData.top : 0) + \'%\' }" data-ng-src="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}" data-ng-srcset="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.5\' ) }} 1.5x, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'2.0\' ) }} 2.0x"></picture></div><div data-ng-click="sendAnswer( answer._id )" data-ng-repeat="answer in question.answers" class="questionnaire__answer" data-ng-class="{\'theme-button-color questionnaire__answer--selected\': questionAnswer.selected === answer._id, \'theme-answer-background-color theme-answer-border-color\': questionAnswer.selected !== answer._id, \'questionnaire__answer--notcorrect\': !!questionAnswer.selected && questionAnswer.selected !== answer._id }"><div class="answer__bar" style="width:{{ !!questionAnswer.stats[answer._id] ? (100 * questionAnswer.stats[answer._id]) : 0 | number:1 }}%" data-ng-class="{\'theme-answer-select-background-result-color\': questionAnswer.selected === answer._id, \'theme-answer-background-result-color\': questionAnswer.selected !== answer._id }" data-ng-if="question.settings.showAnswers && question.settings.showAnswers !== false && !!questionAnswer.stats"></div><label data-ng-class="{ \'theme-question-color\': questionAnswer.selected === answer._id, \'theme-answer-color\': questionAnswer.selected !== answer._id }">{{answer.text}} <span data-ng-if="!!questionAnswer.stats" class="theme-question-result-color-text ng-animate"><span data-ng-if="question.settings.showAnswers && question.settings.showAnswers !== false">{{ formatAnswers(questionAnswer.stats[answer._id]) | number:1 }} %</span> <i class="fa" data-ng-if="!!question.settings.showCorrectAnswer && question.settings.showCorrectAnswer !== false" data-ng-class="{\'fa-check\': questionAnswer.correct === answer._id, \'fa-times\': questionAnswer.correct !== answer._id }"></i> <span></span></span></label></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-pictureChoice.html',
    '<h2 class="theme-question-color text-left" data-ng-bind-html="question.text | nl2br" data-ng-if="!!question.text"></h2><div class="header__wrapper" data-ng-if="!!currentQuestion.mainMedia() && !!mainMediaImg()"><picture class="main-media-image" data-ng-class="{\'no-transform\': !question.imageData, \'transform\': question.imageData}" data-ng-style="{\'padding-bottom\': mainMediaImg().paddingBottom + \'%\'}"><img data-ng-style="{ \'width\': mainMediaImg().width + \'%\', \'left\' : (question.imageData.left > 0 ? question.imageData.left : 0) + \'%\', \'top\' : (question.imageData.top > 0 ? question.imageData.top : 0) + \'%\' }" data-ng-src="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}" data-ng-srcset="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.5\' ) }} 1.5x, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'2.0\' ) }} 2.0x"></picture></div><div class="list"><div data-ng-repeat="answer in question.answers" class="questionnaire__answer questionnaire__answer--picture-choice" data-ng-class="{\'questionnaire__answer--selected\': questionAnswer.selected === answer._id, \'questionnaire__answer--notcorrect\': !!questionAnswer.selected && questionAnswer.selected !== answer._id }" data-ng-click="sendAnswer( answer._id )"><figure data-ng-class="{ \'theme-button-color questionnaire__answer--selected\': questionAnswer.selected === answer._id, \'theme-answer-background-color theme-answer-border-color\': questionAnswer.selected !== answer._id, \'questionnaire__answer--notcorrect\': !!questionAnswer.selected && questionAnswer.selected !== answer._id }"><div class="wrapper ir"><picture class="thumb-media-image"><img data-ng-src="{{ getImgUrl( currentQuestion.answerMedia( answer.imageFile ), 300, \'1.0\' ) }}" data-ng-srcset="{{ getImgUrl( currentQuestion.answerMedia( answer.imageFile ), 300, \'1.0\' ) }}, {{ getImgUrl( currentQuestion.answerMedia( answer.imageFile ), 300, \'1.5\' ) }} 1.5x, {{ getImgUrl( currentQuestion.answerMedia( answer.imageFile ), 300, \'2.0\' ) }} 2.0x"></picture><div class="answer__bar" data-ng-class="{\'theme-answer-select-background-result-color\': questionAnswer.selected === answer._id, \'theme-answer-background-result-color\': questionAnswer.selected !== answer._id }" style="-moz-transform: translate(-50%, {{100 - formatAnswers(questionAnswer.stats[answer._id]) | number:1}}% ); -webkit-transform: translate(-50%, {{100 - formatAnswers(questionAnswer.stats[answer._id]) | number:1}}%); -o-transform: translate(-50%, {{100 - formatAnswers(questionAnswer.stats[answer._id]) | number:1}}%); -ms-transform: translate(-50%, {{100 - formatAnswers(questionAnswer.stats[answer._id]) | number:1}}%); transform: translate(-50%, {{100 - formatAnswers(questionAnswer.stats[answer._id]) | number:1}}%);" data-ng-if="question.settings.showAnswers && question.settings.showAnswers !== false && !!questionAnswer.stats"></div></div><figcaption data-ng-class="{ \'theme-question-color\': questionAnswer.selected === answer._id, \'theme-answer-color\': questionAnswer.selected !== answer._id }">{{ answer.text }}</figcaption><div class="results" data-ng-class="{ \'theme-question-color\': questionAnswer.selected === answer._id, \'theme-answer-color\': questionAnswer.selected !== answer._id}" data-ng-if="!!questionAnswer.stats"><span class="results__precent" data-ng-if="question.settings.showAnswers && question.settings.showAnswers !== false">{{ !!questionAnswer.stats[answer._id] ? (100 * questionAnswer.stats[answer._id]) : 0 | number:1 }}<span class="precent">%</span></span> <span class="results__triangle" data-ng-if="question.settings.showCorrectAnswer && question.settings.showCorrectAnswer !== false" data-ng-class="{\'is-correct\': !!question.settings.showCorrectAnswer && !!questionAnswer.status[ answer._id ].correct, \'is-incorrect\': !questionAnswer.status[ answer._id ].correct }"><i class="fa" data-ng-class="{\'fa-check\': !!questionAnswer.status[ answer._id ].correct, \'fa-times\': !questionAnswer.status[ answer._id ].correct }"></i></span></div></figure></div></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-rateIt.html',
    '<h2 class="theme-question-color text-left" data-ng-bind-html="question.text | nl2br" data-ng-if="!!question.text"></h2><picture class="main-media-image" data-ng-if="!!currentQuestion.mainMedia() && !!mainMediaImg()" data-ng-class="{\'no-transform\': !question.imageData, \'transform\': question.imageData}" data-ng-style="{\'padding-bottom\': mainMediaImg().paddingBottom + \'%\'}"><img data-ng-style="{ \'width\': mainMediaImg().width + \'%\', \'left\' : (question.imageData.left > 0 ? question.imageData.left : 0) + \'%\', \'top\' : (question.imageData.top > 0 ? question.imageData.top : 0) + \'%\' }" data-ng-src="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}" data-ng-srcset="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.5\' ) }} 1.5x, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'2.0\' ) }} 2.0x"></picture><div class="list list__rating list__rating--{{question.rateIt.rateType || \'star\'}}" data-ng-init="AA = makeTimes(question.rateIt.maxRateItValue || 5)"><span data-ng-click="sendAnswer(AA.length - $index, $event)" class="theme-answer-color" data-ng-class="{\'item__selected\': questionAnswer.selected >= AA.length - $index}" data-ng-repeat="r in AA" data-ng-if="question.rateIt.rateType !== \'number\'"><i class="fa"></i> <span class="number">{{AA.length - $index}}</span></span> <span data-ng-click="sendAnswer(AA.length - $index, $event)" class="theme-answer-color" data-ng-class="{\'item__selected\': questionAnswer.selected == AA.length - $index}" data-ng-repeat="r in AA" data-ng-if="question.rateIt.rateType === \'number\'"><i class="fa"></i> <span class="number">{{AA.length - $index}}</span></span></div><div class="footer-rating"><div class="cell"><div class="rating__label theme-question-color text-left"><span>{{question.rateIt.minLabel}}</span></div></div><div class="cell"><div class="rating__results theme-question-color"><span data-ng-if="questionAnswer.average">Average: {{ questionAnswer.average | number:1 }}</span></div></div><div class="cell"><div class="rating__label theme-question-color text-right"><span>{{question.rateIt.maxLabel}}</span></div></div></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-startPage.html',
    '<h2 class="theme-question-color text-center" data-ng-bind-html="question.text | nl2br" data-ng-if="!!question.text"></h2><div class="main-content-description theme-question-color text-center" data-ng-if="!!question.description"><p>{{question.description}}</p></div><picture class="main-media-image" data-ng-if="!!currentQuestion.mainMedia() && !!mainMediaImg()" data-ng-class="{\'no-transform\': !question.imageData, \'transform\': question.imageData}" data-ng-style="{\'padding-bottom\': mainMediaImg().paddingBottom + \'%\'}"><img data-ng-style="{ \'width\': mainMediaImg().width + \'%\', \'left\' : (question.imageData.left > 0 ? question.imageData.left : 0) + \'%\', \'top\' : (question.imageData.top > 0 ? question.imageData.top : 0) + \'%\' }" data-ng-src="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}" data-ng-srcset="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.5\' ) }} 1.5x, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'2.0\' ) }} 2.0x"></picture><div class="text-center main-footer"><button class="btn btn--round-corner btn--normal theme-button-color theme-question-color" data-ng-show="hasNext()" data-ng-click="next($event)">{{question.coverPage.buttonText || "Let\'s get started"}}</button></div>');
}]);

'use strict';

angular.module('4screens.engageform').controller( 'engageformDefaultCtrl',
  ["CONFIG", "EngageformBackendService", "CloudinaryService", "$scope", "$routeParams", "$timeout", "$window", "previewMode", function( CONFIG, EngageformBackendService, CloudinaryService, $scope, $routeParams, $timeout, $window, previewMode ) {
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

  }]
);

'use strict';

angular.module('4screens.engageform').directive( 'engageformSwiperDirective',
  ["$timeout", function( $timeout ) {
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
              });
            });
          });
        });
      }
    };
  }]
);

'use strict';

angular.module('4screens.engageform').filter( 'nl2br', ["$sce", function( $sce ) {
  return function( message ) {
    return $sce.trustAsHtml(
      ( message + '' ).replace( /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2' )
    );
  };
}]);

'use strict';

angular.module('4screens.engageform').filter( 'questionsFilter', function () {
  return function ( a ) {
    var A = a;
    angular.forEach( A, function ( e, i ) {
      if (e.type === 'startPage' && i !== 0) {
        A.unshift( A.splice( i, 1 )[0] );
      }
    });
    return A;
  };
});
'use strict';

angular.module('4screens.engageform').factory( 'EngageformBackendService',
  ["CONFIG", "CommonLocalStorageService", "SettingsEngageformService", "$q", "$filter", function( CONFIG, CommonLocalStorageService, SettingsEngageformService, $q, $filter ) {
    var _quiz
      , _questions = []
      , _normalQuestionsAmmount
      , _questionIndex = 0
      , _cache = {}
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
        },
        submit: function( engageFormId ) {
          return SettingsEngageformService.submitQuiz( engageFormId, _cache[ USER_IDENTIFIER ], _cache[ USER_IDENTIFIER_GLOBAL ] ).then(function() {

            // Clear LS and _cache
            CommonLocalStorageService.clearAll();
            CommonLocalStorageService.set( USER_IDENTIFIER_GLOBAL, _cache[ USER_IDENTIFIER_GLOBAL ] );

            _cache = {};
            _cache[ USER_IDENTIFIER_GLOBAL ] = CommonLocalStorageService.get( USER_IDENTIFIER_GLOBAL );
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
          return _questions[ _questionIndex ].answers;
        },
        requiredAnswer: function() {
          return _questions[ _questionIndex ].requiredAnswer;
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
          return _questionIndex < _normalQuestionsAmmount;
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
        }
      }
    };
  }]
);

'use strict';

angular.module('4screens.engageform').factory( 
  'CloudinaryService',
  [ 'CONFIG',
    function ( CONFIG ) {
      // cloudinaryUrl - Cloudinary cloud name, this need to be added to your CONFIG file
      var cloudinaryUrl = CONFIG.backend.cloudinaryUrl || 'http://res.cloudinary.com/test4screens/image/fetch/';

      return {
        getImgUrl: function ( src, w, dpr, blur ) {
          var blur = typeof blur !== 'undefined' && blur !== '0' ? ',e_blur:' + parseInt( blur, 10 ) * 100 + '/' : '/'
          , dpr = ',dpr_' + dpr;
          
          return cloudinaryUrl + 'w_' + parseInt( w, 10 ) + ',c_limit' + dpr + blur + src;
        },
        getMainImgUrl: function ( src, sw, w, h, ox, oy ) {
          return cloudinaryUrl + 'w_' + parseInt( sw, 10 ) + '/' + 'w_' + w + ',h_' + h + ',x_' + ox + ',y_' + oy + ',c_crop/' + src;
        }
      };
    } ]
);