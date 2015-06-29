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
  'djds4rce.angular-socialshare',
  'ngMessages'
]).config([ 'localStorageServiceProvider', function( localStorageServiceProvider ) {
  // localStorageService
  localStorageServiceProvider.prefix = '4screens.engageform';
} ]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/main.html',
    '<link rel="stylesheet" type="text/css" data-ng-href="{{ customThemeCssFile || staticThemeCssFile }}" data-ng-if="!!customThemeCssFile || !!staticThemeCssFile"><div id="four-screens-application" class="{{screenType}}" ng-class="themeName + (isEmbedded ? \' embedded\' : \'\') + (isMobile ? \' mobile\' : \'\')"><div class="theme-background-image-file-wrapper theme-background-brightness theme-background-color"><picture data-ng-if="quiz.theme.backgroundImageFile" class="position-{{quiz.theme.backgroundImagePosition}}"><source media="(min-width: 1021px)" data-ng-srcset="{{ getBgImgUrl( quiz.theme.backgroundImageFile, 1920, \'1.0\', quiz.theme.backgroundImageBlur ) }}, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 1920, \'1.5\', quiz.theme.backgroundImageBlur ) }} 1.5x, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 1920, \'2.0\', quiz.theme.backgroundImageBlur ) }} 2.0x"><source media="(min-width: 769px)" data-ng-srcset="{{ getBgImgUrl( quiz.theme.backgroundImageFile, 1020, \'1.0\', quiz.theme.backgroundImageBlur ) }}, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 1020, \'1.5\', quiz.theme.backgroundImageBlur ) }} 1.5x, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 1020, \'2.0\', quiz.theme.backgroundImageBlur ) }} 2.0x"><source media="(min-width: 481px)" data-ng-srcset="{{ getBgImgUrl( quiz.theme.backgroundImageFile, 768, \'1.0\', quiz.theme.backgroundImageBlur ) }}, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 768, \'1.5\', quiz.theme.backgroundImageBlur ) }} 1.5x, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 768, \'2.0\', quiz.theme.backgroundImageBlur ) }} 2.0x"><source media="(min-width: 0px)" data-ng-srcset="{{ getBgImgUrl( quiz.theme.backgroundImageFile, 480, \'1.0\', quiz.theme.backgroundImageBlur ) }}, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 480, \'1.5\', quiz.theme.backgroundImageBlur ) }} 1.5x, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 480, \'2.0\', quiz.theme.backgroundImageBlur ) }} 2.0x"><img data-ng-src="{{ getBgImgUrl( quiz.theme.backgroundImageFile, 1920, \'1.0\', quiz.theme.backgroundImageBlur ) }}" data-ng-srcset="{{ getBgImgUrl( quiz.theme.backgroundImageFile, 1920, \'1.0\', quiz.theme.backgroundImageBlur ) }}, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 1920, \'1.5\', quiz.theme.backgroundImageBlur ) }} 1.5x, {{ getBgImgUrl( quiz.theme.backgroundImageFile, 1920, \'2.0\', quiz.theme.backgroundImageBlur ) }} 2.0x"></picture></div><div class="four-screens__embed-container theme-main-font" data-ng-class="wayAnimateClass"><div data-ng-repeat="question in questions" class="questionnaire animate-if" data-ng-if="$index == currentQuestion.index()"><div class="question-content-wrapper question-content-wrapper--{{question.type}}" observe-height><div class="four-screens__content wrapper" data-ng-class="{ \'content__type--forms\': question.type == \'forms\', \'content__type--multi-choice\': question.type == \'multiChoice\', \'content__type--picture-choice\': question.type == \'pictureChoice\', \'content__type--rate-it\': question.type == \'rateIt\', \'content__type--start-page\': question.type == \'startPage\', \'content__type--end-page\': question.type == \'endPage\', \'content__type--summary-page\': question.type == \'summaryPage\' }" data-ng-include="\'views/engageform/question-\' + question.type + \'.html\'"></div></div></div></div><div class="four-screens__embed-container theme-main-font page404" data-ng-if="show404"><div class="questionnaire animate-if"><div class="question-content-wrapper question-content-wrapper--404"><div class="four-screens__content wrapper"><h2 class="theme-question-color text-center">Engageform not found</h2><div class="main-content-description theme-question-color text-center"><p>We\'re sorry, we can\'t find the engageform you\'re looking for.</p></div></div></div></div></div><div class="message-box message-box__require theme-button-color theme-question-color" data-ng-class="{\'is-active\': !!requiredMessage }">{{requiredMessage}}</div><div class="four-screens__footer" data-ng-if="questions[currentQuestion.index()].type !== \'startPage\' && questions[currentQuestion.index()].type !== \'endPage\'"><div class="progress"><span class="progress__bar"><span class="progress__bar--line theme-button-color" data-ng-class="{\'progress__bar--full-size\': progressBarWidth() === 100 }" data-ng-style="{\'width\': progressBarWidth()+\'%\'}"></span></span></div><div class="four-screens__footer-logo"><span>Made with:</span> <a title="4Screens" href="http://4screens.net/" target="_blank" ng-class="{ \'logo-dark-32\': themeName === \'theme-dark\' || ( themeName === \'theme-light\' && isHigherThanViewport ) || ( themeName === \'theme-light\' && smallViewport ) || show404, \'logo-light-32\': themeName === \'theme-light\' && !isHigherThanViewport && !smallViewport }">4Screens</a></div><button class="progress__btn progress__btn--prev fa-stack fa-lg" data-ng-show="hasPrev()" data-ng-click="prev()"><i class="fa fa-circle fa-stack-2x theme-navigation-btn-color"></i> <i class="fa fa-angle-left"></i></button> <button class="progress__btn progress__btn--next fa-stack fa-lg" data-ng-show="pagination.curr() < pagination.last" data-ng-click="next($event)"><i class="fa fa-circle fa-stack-2x theme-navigation-btn-color"></i> <i class="fa fa-angle-right"></i></button> <button class="progress__btn progress__btn--submit theme-button-color theme-question-color" data-ng-show="pagination.curr() == pagination.last && !summaryMode" data-ng-click="submitQuiz($event)"><span>submit</span></button></div></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-endPage.html',
    '<div class="scored theme-question-color" data-ng-if="quiz.type === \'score\'">{{ question.coverPage.scoreLabel || \'You scored\' }} <span class="scored-text"><span class="scored-text-fill" data-ng-style="{height: ( 100 - scoredPoints ) + \'%\'}">{{scoredPoints || 0}}</span>{{ (scoredPoints || 0) + \'%\'}}</span></div><h2 class="theme-question-color text-center" data-ng-bind-html="question.text | nl2br" data-ng-if="!!question.text"></h2><div class="main-content-description theme-question-color text-center" data-ng-if="!!question.description"><p data-ng-bind-html="question.description | nl2br"></p></div><picture class="main-media-image" data-ng-if="!!currentQuestion.mainMedia() && !!mainMediaImg()" data-ng-class="{\'no-transform\': !question.imageData, \'transform\': question.imageData}" data-ng-style="{\'padding-bottom\': mainMediaImg().paddingBottom + \'%\'}"><img data-ng-style="{ \'width\': mainMediaImg().width + \'%\', \'left\' : (question.imageData.left > 0 ? question.imageData.left : 0) + \'%\', \'top\' : (question.imageData.top > 0 ? question.imageData.top : 0) + \'%\' }" data-ng-src="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}" data-ng-srcset="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.5\' ) }} 1.5x, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'2.0\' ) }} 2.0x"></picture><div class="text-center main-footer" data-ng-if="question.coverPage.exitLink"><a ng-if="question.coverPage.link" class="btn btn--round-corner btn--normal theme-button-color theme-question-color" rel="nofollow" target="_blank" title="{{question.coverPage.buttonText}}" data-ng-href="{{(question.coverPage.link.indexOf(\'http\') === -1 ? \'http://\' : \'\') + question.coverPage.link}}">{{question.coverPage.buttonText || "Thank You"}}</a> <span ng-if="!question.coverPage.link" class="btn btn--round-corner btn--normal theme-button-color theme-question-color" title="{{question.coverPage.buttonText}}">{{question.coverPage.buttonText || "Thank You" }}</span></div><div data-ng-if="question.coverPage.showSocialShares && socialShare().enabled" data-ng-include="\'views/engageform/social-share.html\'"></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-forms.html',
    '<h2 class="theme-question-color text-left" data-ng-bind-html="question.text | nl2br" data-ng-if="!!question.text"></h2><div class="main-content-description theme-question-color text-left" data-ng-if="!!question.description"><p data-ng-bind-html="question.description | nl2br"></p></div><picture class="main-media-image" data-ng-if="!!currentQuestion.mainMedia() && !!mainMediaImg()" data-ng-class="{\'no-transform\': !question.imageData, \'transform\': question.imageData}" data-ng-style="{\'padding-bottom\': mainMediaImg().paddingBottom + \'%\'}"><img data-ng-style="{ \'width\': mainMediaImg().width + \'%\', \'left\' : (question.imageData.left > 0 ? question.imageData.left : 0) + \'%\', \'top\' : (question.imageData.top > 0 ? question.imageData.top : 0) + \'%\' }" data-ng-src="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}" data-ng-srcset="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.5\' ) }} 1.5x, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'2.0\' ) }} 2.0x"></picture><form action name="form" class="form" formnovalidate><fieldset><div class="form__field" data-ng-repeat="input in question.forms.inputs"><label for="{{input._id}}" data-ng-bind="input.label"></label> <input type="email" validate-full-email placeholder="{{input.label}}" name="{{input._id}}" data-ng-if="input.type==\'email\'" data-ng-model="questionAnswer.status[input._id]" formnovalidate ng-required="currentQuestion.requiredAnswer()"> <input type="text" placeholder="{{input.label}}" name="{{input._id}}" data-ng-if="input.type==\'text\'" data-ng-model="questionAnswer.status[input._id]" formnovalidate ng-required="currentQuestion.requiredAnswer()"> <input type="tel" placeholder="{{input.label}}" name="{{input._id}}" data-ng-if="input.type==\'phone\'" data-ng-model="questionAnswer.status[input._id]" formnovalidate ng-required="currentQuestion.requiredAnswer()"> <input type="url" placeholder="{{input.label}}" name="{{input._id}}" data-ng-if="input.type==\'url\'" data-ng-model="questionAnswer.status[input._id]" formnovalidate ng-required="currentQuestion.requiredAnswer()"> <textarea name="{{input._id}}" id cols="30" rows="10" data-ng-if="input.type==\'textarea\'" placeholder="{{input.label}}" data-ng-model="questionAnswer.status[input._id]" formnovalidate ng-required="currentQuestion.requiredAnswer()"></textarea> <span data-ng-if="question.settings.showAnswers && questionAnswer.selected && summaryMode" class="form__field--filled" ng-class="{\'textarea\': input.type==\'textarea\' }"><span>Filled {{ questionAnswer.count }} time{{ questionAnswer.count === 1 ? \'\' : \'s\' }}</span> <span><div data-ng-messages="form[input._id].$error" class="message text-right" data-ng-class="{\'is-active\': !!form[input._id].$error.fullEmail || !!form[input._id].$error.url}"><div data-ng-message="fullEmail">Your field has an invalid email address</div><div data-ng-message="email">Your field has an invalid email address</div><div data-ng-message="number">Only numbers</div><div data-ng-message="url">Your field has a invalid url address</div></div></span></span></div><input type="text" class="hidden" name="form" data-ng-model="questionAnswer.form" data-ng-init="questionAnswer.form=form"></fieldset><div class="hint"><i class="fa fa-info-circle"></i>&nbsp;<span>Type your answer above. Press next to continue.</span></div></form>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-multiChoice.html',
    '<h2 class="theme-question-color text-left" data-ng-bind-html="question.text | nl2br" data-ng-if="!!question.text"></h2><div class="main-content-description theme-question-color text-left" data-ng-if="!!question.description"><p data-ng-bind-html="question.description | nl2br"></p></div><div class="header__wrapper" data-ng-if="!!currentQuestion.mainMedia() && !!mainMediaImg()"><picture class="main-media-image" data-ng-class="{\'no-transform\': !question.imageData, \'transform\': question.imageData}" data-ng-style="{\'padding-bottom\': mainMediaImg().paddingBottom + \'%\'}"><img data-ng-style="{ \'width\': mainMediaImg().width + \'%\', \'left\' : (question.imageData.left > 0 ? question.imageData.left : 0) + \'%\', \'top\' : (question.imageData.top > 0 ? question.imageData.top : 0) + \'%\' }" data-ng-src="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}" data-ng-srcset="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.5\' ) }} 1.5x, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'2.0\' ) }} 2.0x"></picture></div><div data-ng-click="sendAnswer( answer._id )" data-ng-repeat="answer in question.answers" class="questionnaire__answer" data-ng-class="{\'theme-button-color questionnaire__answer--selected\': questionAnswer.selected === answer._id, \'theme-answer-background-color theme-answer-border-color\': questionAnswer.selected !== answer._id, \'questionnaire__answer--notcorrect\': !!questionAnswer.selected && questionAnswer.selected !== answer._id }"><div class="answer__bar theme-answer-select-background-result-color" ng-style="{\'width\': formatAnswers(questionAnswer.stats[answer._id])+\'%\'}" data-ng-if="question.settings.showAnswers && question.settings.showAnswers !== false"></div><label data-ng-class="{ \'theme-question-color\': questionAnswer.selected === answer._id, \'theme-answer-color\': questionAnswer.selected !== answer._id }">{{answer.text}} <span class="theme-question-result-color-text ng-animate"><span data-ng-if="question.settings.showAnswers && questionAnswer.selected">{{ formatAnswers(questionAnswer.stats[answer._id]) | number:1 }} %</span> <i class="fa" data-ng-if="question.settings.showCorrectAnswer && questionAnswer.selected === answer._id" data-ng-class="{\'fa-check\': questionAnswer.correct === answer._id, \'fa-times\': questionAnswer.correct !== answer._id }"></i> <span></span></span></label></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-pictureChoice.html',
    '<h2 class="theme-question-color text-left" data-ng-bind-html="question.text | nl2br" data-ng-if="!!question.text"></h2><div class="main-content-description theme-question-color text-left" data-ng-if="!!question.description"><p data-ng-bind-html="question.description | nl2br"></p></div><div class="header__wrapper" data-ng-if="!!currentQuestion.mainMedia() && !!mainMediaImg()"><picture class="main-media-image" data-ng-class="{\'no-transform\': !question.imageData, \'transform\': question.imageData}" data-ng-style="{\'padding-bottom\': mainMediaImg().paddingBottom + \'%\'}"><img data-ng-style="{ \'width\': mainMediaImg().width + \'%\', \'left\' : (question.imageData.left > 0 ? question.imageData.left : 0) + \'%\', \'top\' : (question.imageData.top > 0 ? question.imageData.top : 0) + \'%\' }" data-ng-src="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}" data-ng-srcset="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.5\' ) }} 1.5x, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'2.0\' ) }} 2.0x"></picture></div><div class="list"><div data-ng-repeat="answer in question.answers" class="questionnaire__answer questionnaire__answer--picture-choice" data-ng-class="{\'questionnaire__answer--selected\': questionAnswer.selected === answer._id, \'questionnaire__answer--notcorrect\': !!questionAnswer.selected && questionAnswer.selected !== answer._id }" data-ng-click="sendAnswer( answer._id )"><figure data-ng-class="{ \'theme-answer-select-background-result-color\': questionAnswer.selected === answer._id, \'theme-answer-background-color theme-answer-border-color\': questionAnswer.selected !== answer._id, \'questionnaire__answer--notcorrect\': !!questionAnswer.selected && questionAnswer.selected !== answer._id }"><div class="image-wrapper"><picture class="thumb-media-image"><img ng-if="answer.imageFile" data-ng-style="{ \'width\': answer.imageData.width + \'%\', \'left\': answer.imageData.left + \'%\', \'top\': answer.imageData.top + \'%\' }" data-ng-src="{{ getImgUrl( currentQuestion.answerMedia( answer.imageFile ), 300, \'1.0\' ) }}" data-ng-srcset="{{ getImgUrl( currentQuestion.answerMedia( answer.imageFile ), 300, \'1.0\' ) }}, {{ getImgUrl( currentQuestion.answerMedia( answer.imageFile ), 300, \'1.5\' ) }} 1.5x, {{ getImgUrl( currentQuestion.answerMedia( answer.imageFile ), 300, \'2.0\' ) }} 2.0x"></picture><div class="answer__bar" data-ng-if="question.settings.showAnswers && question.settings.showAnswers !== false && !!questionAnswer.stats"></div></div><figcaption class="theme-answer-color">{{ answer.text }}</figcaption><div class="results"><span class="results__precent" data-ng-if="question.settings.showAnswers && question.settings.showAnswers !== false && questionAnswer.selected">{{ !!questionAnswer.stats[answer._id] ? (100 * questionAnswer.stats[answer._id]) : 0 | number:1 }}<span class="precent">%</span></span> <span class="results__triangle" data-ng-if="question.settings.showCorrectAnswer && question.settings.showCorrectAnswer !== false && questionAnswer.selected === answer._id" data-ng-class="{\'is-correct\': !!question.settings.showCorrectAnswer && !!questionAnswer.status[ answer._id ].correct, \'is-incorrect\': !questionAnswer.status[ answer._id ].correct }"><i class="fa" data-ng-class="{\'fa-check\': questionAnswer.status[ answer._id ].correct, \'fa-times\': !questionAnswer.status[ answer._id ].correct }"></i></span></div></figure></div></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-rateIt.html',
    '<h2 class="theme-question-color text-left" data-ng-bind-html="question.text | nl2br" data-ng-if="!!question.text"></h2><picture class="main-media-image" data-ng-if="!!currentQuestion.mainMedia() && !!mainMediaImg()" data-ng-class="{\'no-transform\': !question.imageData, \'transform\': question.imageData}" data-ng-style="{\'padding-bottom\': mainMediaImg().paddingBottom + \'%\'}"><img data-ng-style="{ \'width\': mainMediaImg().width + \'%\', \'left\' : (question.imageData.left > 0 ? question.imageData.left : 0) + \'%\', \'top\' : (question.imageData.top > 0 ? question.imageData.top : 0) + \'%\' }" data-ng-src="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}" data-ng-srcset="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.5\' ) }} 1.5x, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'2.0\' ) }} 2.0x"></picture><div class="list list__rating list__rating--{{question.rateIt.rateType || \'star\'}}" data-ng-init="AA = makeTimes(question.rateIt.maxRateItValue || 5)"><span data-ng-click="sendAnswer(AA.length - $index, $event)" class="theme-question-color" data-ng-class="{\'item__selected\': questionAnswer.selected >= AA.length - $index}" data-ng-repeat="r in AA" data-ng-if="question.rateIt.rateType !== \'number\'"><i class="fa"></i> <span class="number">{{AA.length - $index}}</span></span> <span data-ng-click="sendAnswer(AA.length - $index, $event)" class="theme-question-color" data-ng-class="{\'item__selected\': questionAnswer.selected == AA.length - $index}" data-ng-repeat="r in AA" data-ng-if="question.rateIt.rateType === \'number\'"><i class="fa"></i> <span class="number">{{AA.length - $index}}</span></span></div><div class="footer-rating"><div class="cell"><div class="rating__label theme-question-color text-left"><span>{{question.rateIt.minLabel}}</span></div></div><div class="cell"><div class="rating__results theme-question-color"><span data-ng-if="questionAnswer.average">Average: {{ questionAnswer.average | number:1 }}</span></div></div><div class="cell"><div class="rating__label theme-question-color text-right"><span>{{question.rateIt.maxLabel}}</span></div></div></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-startPage.html',
    '<h2 class="theme-question-color text-center" data-ng-bind-html="question.text | nl2br" data-ng-if="!!question.text"></h2><div class="main-content-description theme-question-color text-center" data-ng-if="!!question.description"><p data-ng-bind-html="question.description | nl2br"></p></div><picture class="main-media-image" data-ng-if="!!currentQuestion.mainMedia() && !!mainMediaImg()" data-ng-class="{\'no-transform\': !question.imageData, \'transform\': question.imageData}" data-ng-style="{\'padding-bottom\': mainMediaImg().paddingBottom + \'%\'}"><img data-ng-style="{ \'width\': mainMediaImg().width + \'%\', \'left\' : (question.imageData.left > 0 ? question.imageData.left : 0) + \'%\', \'top\' : (question.imageData.top > 0 ? question.imageData.top : 0) + \'%\' }" data-ng-src="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}" data-ng-srcset="{{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.0\' ) }}, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'1.5\' ) }} 1.5x, {{ getMainImgUrl( currentQuestion.mainMedia().src, 680, \'2.0\' ) }} 2.0x"></picture><div class="quiz-icon quiz-icon-big" data-ng-if="!currentQuestion.mainMedia() && currentQuestion.settings(\'showMainMedia\')"><i class="fa theme-question-color" data-ng-class="{ \'fa-bar-chart\': quiz.type === \'poll\', \'fa-edit\': quiz.type === \'survey\', \'fa-trophy\': quiz.type === \'score\', \'fa-group\': quiz.type === \'outcome\' }"></i></div><div class="text-center main-footer"><button class="btn btn--round-corner btn--normal theme-button-color theme-question-color" data-ng-show="hasNext()" data-ng-click="next($event)">{{question.coverPage.buttonText || "Let\'s get started"}}</button> <button class="btn btn--round-corner btn--normal theme-button-color theme-question-color" data-ng-show="!hasNext()">{{question.coverPage.buttonText || "Let\'s get started"}}</button></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/question-summaryPage.html',
    '<h2 class="theme-question-color text-center" data-ng-bind-html="question.text | nl2br" data-ng-if="!!question.text"></h2><div data-ng-repeat="answer in question.stats" class="questionnaire__answer theme-answer-background-color theme-answer-border-color questionnaire__answer--notcorrect"><div class="answer__bar theme-answer-select-background-result-color" ng-style="{\'width\': formatAnswers(answer.percent)+\'%\'}"></div><label class="theme-answer-color">{{ answer.title ? answer.title + \' (\' + answer.group + \')\' : answer.group }} <span class="theme-question-result-color-text ng-animate"><span>{{ formatAnswers(answer.percent) | number:1 }} %</span> <i class="fa" data-ng-if="question.settings.showCorrectAnswer && questionAnswer.selected === answer._id" data-ng-class="{\'fa-check\': questionAnswer.correct === answer._id, \'fa-times\': questionAnswer.correct !== answer._id }"></i> <span></span></span></label></div>');
}]);

angular.module('4screens.engageform').run(['$templateCache', function($templateCache) {
  $templateCache.put('views/engageform/social-share.html',
    '<section class="social-shares--icons"><a class="social-shares--icons__fb" data-ng-click="socialShare().facebook.share()"><i class="fa fa-facebook"></i></a><a class="social-shares--icons__twitter" href="https://twitter.com/intent/tweet?text={{ socialShare().link + \' \' + socialShare().title + \' \' + socialShare().description }}"><i class="fa fa-twitter"></i></a></section>');
}]);

'use strict';

angular.module('4screens.engageform').controller( 'engageformDefaultCtrl',
  ["CONFIG", "EngageformBackendService", "CloudinaryService", "$scope", "$routeParams", "$timeout", "$window", "$document", "$http", "$q", "previewMode", "summaryMode", "message", "isMobile", "isEmbedded", "openInFullscreen", function( CONFIG, EngageformBackendService, CloudinaryService, $scope, $routeParams, $timeout, $window, $document,
            $http, $q, previewMode, summaryMode, message, isMobile, isEmbedded, openInFullscreen ) {

    var nextQuestionTimeout,
        quizId = $routeParams.engageFormId,
        $body = angular.element( $document.find('body').eq( 0 ) ),
        questionSortingDefer = $q.defer(),
        summaryPage;

    $scope.smallViewport = $window.innerWidth <= 1024;

    // Is in iframe?
    $scope.isEmbedded = isEmbedded;

    // Runs on a mobile device?
    $scope.isMobile = isMobile;

    $scope.$on( 'height-changed', function( event, data ) {
      // Add or remove class on the body element depending on the question's height.
      if (data.isHigherThanViewport) {
        $body.addClass('higher-than-window');
        $scope.isHigherThanViewport = data.isHigherThanViewport;
      } else {
        $body.removeClass('higher-than-window');
        $scope.isHigherThanViewport = data.isHigherThanViewport;
      }

      // Inform the parent window (in the embedded environment) about the page change.
      // TODO: Should emit 'height-changed' message. Page changed should be moved to its own event.
      message.send( 'page-changed', angular.extend( data, { page: $scope.currentQuestion.index() } ) );
    } );

    angular.element( $window ).bind( 'resize' , _.throttle(function(){
      $scope.smallViewport = $window.innerWidth <= 1024;
    }, 200 ) );

    $scope.pagination = { curr: function() {}, last: 0 };
    $scope.summaryMode = summaryMode;

    EngageformBackendService.quiz.get( quizId ).then(function( quiz ) {
      $scope.quiz = quiz;

      setThemeName(quiz.theme.backgroundColor);

      $scope.staticThemeCssFile = EngageformBackendService.quiz.getStaticThemeCssFile();
      EngageformBackendService.questions.get().then(function( questions ) {
        $scope.wayAnimateClass = 'way-animation__next';

        // Get questions
        $scope.questions = _.sortBy( questions, 'position' );

        // Summary mode: filter start and end pages; show answers on and required answers off for every question
        if ( summaryMode ) {
          _.remove( $scope.questions, function( question ) {
            return question.type === 'startPage' || question.type === 'endPage';
          });

          _.map( $scope.questions, function( question ) {
            if ( question.settings ) {
              question.settings.showAnswers = true;
            }

            if ( question.requiredAnswer ) {
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

        questionSortingDefer.resolve();
      });
    }).catch(function() {
      $scope.show404 = true;
    });

    function setThemeName( color ) {

      var colorRGB = colorToRgb( color );

      if ((colorRGB.red * 0.299 + colorRGB.green * 0.587 + colorRGB.blue * 0.114) > 186) {
        $scope.themeName = 'theme-light';
      } else {
        $scope.themeName = 'theme-dark';
      }
    }

    function colorToRgb( color ) {
      var colorParts, temp, triplets;
      if (color[0] === '#') {
        color = color.substr( 1 );
      }
      else {
        colorParts = color.match( /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i );
        color = ( colorParts && colorParts.length === 4 ) ? ( '0' + parseInt( colorParts[1], 10 ).toString( 16 ) ).slice( -2 ) +
          ('0' + parseInt( colorParts[2], 10 ).toString( 16 ) ).slice( -2 ) +
          ('0' + parseInt( colorParts[3], 10 ).toString( 16 ) ).slice( -2 ) : '';
      }

      if (color.length === 3) {
        temp = color;
        color = '';
        temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec( temp ).slice( 1 );
        for (var i = 0; i < 3; i++) {
          color += temp[i] + temp[i];
        }
      }

      triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec( color ).slice( 1 );

      return {
        red: parseInt( triplets[0], 16 ),
        green: parseInt( triplets[1], 16 ),
        blue: parseInt( triplets[2], 16 )
      };
    }


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
      if ( event.origin.indexOf('facebook') > -1 || event.origin.indexOf('twitter') > -1 ) {
        return;
      }

      results = JSON.parse( event.data );

      if ( previewMode && results.name === 'results' ) {
        $scope.$apply(function() {
          EngageformBackendService.preview.setUserResults( results.results ).then( function() {
            $scope.sentAnswer();
          } );
        });
      } else if ( summaryMode && results.name === 'summary' ) {
        $scope.$apply(function() {
          EngageformBackendService.preview.setAnswersResults( results ).then( function( statsEndPage ) {

            if ( !summaryPage ) {
              questionSortingDefer.promise.then(function() {
                var text;

                if ( $scope.quiz.type === 'outcome' ) {
                  text = 'Outcomes';
                } else if ( $scope.quiz.type === 'score' ) {
                  text = 'Scores';
                } else {
                  return $scope.sentAnswer();
                }

                summaryPage = {
                  type: 'summaryPage',
                  text: text,
                  quizId: $routeParams.engageFormId,
                  stats: statsEndPage
                };

                $scope.questions.push( summaryPage );
                $scope.normalQuestions.push( summaryPage );

                $scope.normalQuestionsAmmount = $scope.normalQuestions.length;
                $scope.pagination.last = $scope.normalQuestionsAmmount;
                EngageformBackendService.questions.sync($scope.questions, $scope.currentQuestion.index());
                $scope.sentAnswer();
              });
            }
          } );
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

        if ($scope.hasNext() && !nextQuestionTimeout && $scope.pagination.curr() < $scope.pagination.last && !$scope.currentQuestion.settings('showAnswers')) {
          nextQuestionTimeout = $timeout( function () {
            typeof force === 'undefinded' ? $scope.next() : $scope.next( null, true );
            nextQuestionTimeout = null;
          }, $scope.currentQuestion.settings('showCorrectAnswer') ? 500 : 200 );
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
      var userResults = EngageformBackendService.preview.getUserResults();

      if ( summaryMode ) {
        $scope.pickCorrectEndPage( {} );
        $scope.next( null, true );
        return;
      }

      if ( previewMode && userResults ) {
        $scope.pickCorrectEndPage( userResults );

        if( _.where( $scope.questions, { type: 'endPage' } ).length ) {
          $scope.next( null, true );
        } else {
          $scope.requiredMessage = 'Thank you!';
        }
        return;
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

      if($scope.questions[$scope.currentQuestion.index()].type === 'startPage' && isMobile) {
       openInFullscreen();
      }

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
        // Is valid form, or invalid only couse @ is empty
        } else if( $scope.questionAnswer && $scope.questionAnswer.form && ( $scope.questionAnswer.form.$valid || ( Object.keys($scope.questionAnswer.form.$error).length === 1 && $scope.questionAnswer.form.$error.fullEmail ) ) ) {
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
      /*
      sso.linkedin = {
        share: function () {
          window.open(
            'https://www.linkedin.com/shareArticle?mini=true&url=' + sso.link + '&title=' + sso.title + '&summary' + sso.description,
            '_blank',
            'toolbar=no,scrollbars=no,resizable=yes,width=550,height=500'
          );
        }
      };
      */

      // Personalyze description for outcomes and score
      if ($scope.quiz.type === 'outcome' || $scope.quiz.type === 'score') {
        sso.description = 'I got :result on :quizname on Engageform! What about you?'.replace( ':quizname', $scope.quiz.title );
        sso.description = sso.description.replace( ':result', $scope.quiz.type === 'score' ? ( $scope.scoredPoints || 0 ) + ' percent' : ( $scope.scoredOutcome || '' ) );

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

angular.module('4screens.engageform').directive( 'observeHeight', ["$window", "$timeout", function( $window, $timeout ) {
  return {
    link: function( scope, element ) {
      var timeout;

      /**
       * Returns the element's client height.
       * @returns {number}
       */
      function getHeight() {
        return element[0].clientHeight;
      }

      /**
       * Emits the event containing information about the element's height and if it is higher than the window.
       * @param {number} height Element's height.
       */
      function emit( height ) {
        scope.$emit( 'height-changed', {
          height: height,
          isHigherThanViewport: height > $window.innerHeight
        } );
      }

      /**
       * Polls the height checking and handles differences.
       */
      function pollHeight() {
        var height = getHeight();

        // When the app is embedded, the embed script can change the window size, what leads to resize of
        // some elements. It has impact on the element's height, so it has to be checked again.
        timeout = $timeout(function() {
          var innerHeight = getHeight();

          // If the height hasn't stabilised yet, schedule another check.
          if ( height !== innerHeight ) {
            emit( innerHeight );

            // Polling
            pollHeight();
          }

        }, 50 );
      }

      scope.$on( '$destroy', function() {
        $timeout.cancel( timeout );
      } );

      // Check the height when the scope stabilizes.
      scope.$applyAsync( function() {
        emit(getHeight());
        pollHeight();
      } );
    }
  };
}]);

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
        setAnswersResults: function( summary ){
          var deferred = $q.defer();

          _answerResults = summary && summary.results ? summary.results : null;

          deferred.resolve( summary.statsEndPage );

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

          return value ? value : null;
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
angular.module('4screens.engageform').factory( 'message', ["$window", function( $window ) {
  'use strict';
  return {
    send: function( name, data ) {
      $window.parent.postMessage( angular.extend( { name: name }, data ), '*' );
    },
    on: function( name, callback ) {
      // TODO
    }
  }
}]);

'use strict';
angular.module('4screens.engageform')
  .factory( 'openInFullscreen', ["$document", "message", function( $document, message ) {
    var body = $document[0].body;

    return function() {
      if (body.requestFullscreen) {
        body.requestFullscreen();
        message.send('opened-in-fullscreen');
      } else if (body.msRequestFullscreen) {
        body.msRequestFullscreen();
        message.send('opened-in-fullscreen');
      } else if (body.mozRequestFullScreen) {
        body.mozRequestFullScreen();
        message.send('opened-in-fullscreen');
      } else if (body.webkitRequestFullscreen) {
        body.webkitRequestFullscreen();
        message.send('opened-in-fullscreen');
      } else {
        message.send('request-fullscreen');
      }
    }
  }]);
