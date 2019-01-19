!function(e){var t={};function s(i){if(t[i])return t[i].exports;var r=t[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,s),r.l=!0,r.exports}s.m=e,s.c=t,s.d=function(e,t,i){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)s.d(i,r,function(t){return e[t]}.bind(null,r));return i},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=8)}([function(e,t){e.exports=require("lodash")},function(e,t){e.exports=require("core-js/modules/web.dom.iterable")},function(e,t){e.exports=require("core-js/modules/es6.regexp.replace")},function(e,t){e.exports=require("angular")},function(e,t){e.exports=require("core-js/modules/es7.symbol.async-iterator")},function(e,t){e.exports=require("core-js/modules/es6.symbol")},function(e,t){e.exports=require("core-js/modules/es6.regexp.to-string")},function(e,t){e.exports=require("core-js/modules/es6.regexp.match")},function(e,t,s){"use strict";s.r(t);s(4),s(5),s(1),s(2);var i=s(0);let r;!function(e){e.Outcome="outcome",e.Poll="poll",e.Score="score",e.Survey="survey",e.Live="live"}(r||(r={}));var a=s(3);var n=s.n(a).a.module("4screens.engageform",["4screens.util.cloudinary","LocalStorageModule"]);let o,l;!function(e){e.Undefined="undefined",e.Default="default",e.Preview="preview",e.Result="results",e.Summary="summary"}(o||(o={})),function(e){e[e.Undefined=0]="Undefined",e[e.Live=1]="Live",e[e.Outcome=2]="Outcome",e[e.Poll=3]="Poll",e[e.Score=4]="Score",e[e.Survey=5]="Survey"}(l||(l={}));s(6),s(7);function h(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class g{static create(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return new g(e,g.arePropertiesCustom(e))}static arePropertiesCustom(e){let t=e.text,s=e.link,i=e.imageUrl;return Boolean(g.isTextCustom(t)||s||g.isImageCustom(i))}static isTextCustom(e){return void 0!==e}static isImageCustom(e){return void 0!==e&&e!==g.default.imageUrl}get isCustom(){return this._custom}get isDefault(){return!this._custom}get isCustomLogo(){return this._isCustomLogo}get imageUrl(){return this._imageUrl}get link(){return this._link}get text(){return this._text}get enabled(){return this._enabled}constructor(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.state,s=e.text,i=e.link,r=e.imageUrl,a=arguments.length>1?arguments[1]:void 0;h(this,"_text",void 0),h(this,"_link",void 0),h(this,"_imageUrl",void 0),h(this,"_isCustomLogo",!1),h(this,"_enabled",void 0),h(this,"_custom",void 0),this._custom=a,this._enabled=!t,this._text=g.isTextCustom(s)?s:g.default.text,this._link=i||g.default.link,g.isImageCustom(r)?(this._imageUrl=r?`${re.getConfig("backend").api+re.getConfig("backend").imagesUrl}/${r}`:"",this._isCustomLogo=!0):this._imageUrl=re.config.backend.api+r}}h(g,"default",re.getConfig("backend").branding);class u{constructor(){var e,t,s;s={},(t="_listener")in(e=this)?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s}listen(e,t){this._listener[e]||(this._listener[e]=[]),this._listener[e].push(t)}trigger(e){for(var t=arguments.length,s=new Array(t>1?t-1:0),i=1;i<t;i++)s[i-1]=arguments[i];const r=this._listener[e];r&&r.forEach(e=>e.apply(s))}}function c(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class d{static fromEngageform(e){return new d(e)}constructor(e){let t=e.settings.share,s=e.endPages,r=e.startPages,a=e.pages;c(this,"globalTitle",void 0),c(this,"globalDescription",void 0),this.globalTitle="",this.globalDescription="",t&&(this.globalTitle=t.title||"",this.globalDescription=t.description||""),(s.length<1||!Object(i.find)(a,{social:!0}))&&r.length&&a[r[0]].title&&(this.globalTitle=a[r[0]].title,this.globalDescription=a[r[0]].description)}}function m(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class f{static fromEnageform(e){return new f(e)}constructor(e){m(this,"_engageform",void 0),m(this,"enabled",!1),m(this,"position",0),m(this,"size",0),m(this,"hasStart",!1),m(this,"enabledStart",!0),m(this,"hasPrev",!1),m(this,"enabledPrev",!0),m(this,"hasNext",!1),m(this,"enabledNext",!0),m(this,"hasFinish",!1),m(this,"enabledFinish",!0),m(this,"distance",0),m(this,"animate","swipeNext"),m(this,"hasStartPages",!1),m(this,"hasEndPages",!1),m(this,"waitingForPageChange",null),m(this,"next",this.pick),m(this,"finish",this.pick),this._engageform=e,this.size=e.availablePages.length,this.hasEndPages=Boolean(e.endPages.length),e.startPages.length?(this.hasStart=!0,this.hasStartPages=!0,this._engageform.setCurrent(e.startPages[0])):(this.enabled=!0,this.move(),this.hasPrev=!1)}updateDistance(){return this.distance=this.position/this.size}start(e){this.disableDefaultAction(e),this.animate="swipeNext",this.enabled=!0,this.hasStart=!1,this.move(),this.hasPrev=!0}stopPageChange(){this.waitingForPageChange&&re.$timeout.cancel(this.waitingForPageChange)}prev(e){this.disableDefaultAction(e),this.stopPageChange(),this.animate="swipePrev",this._engageform.current&&(this._engageform.message=""),this.position--,this.updateDistance(),this.hasNext=!0,this.hasFinish=!1,0===this.position?(this._engageform.setCurrent(this._engageform.startPages[0]),this.hasPrev=!1):(this._engageform.setCurrent(this._engageform.availablePages[this.position-1]),this.hasPrev=1!==this.position||this.hasStartPages)}pick(e,t){let s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{quiet:!1};if(this.disableDefaultAction(e),this.stopPageChange(),this.animate="swipeNext",!this._engageform.isNormalMode()){let e=re.$q.defer();return e.resolve(t),this.move(t),e.promise}let i=this._engageform.current;return!t||!this._engageform.settings.allowAnswerChange&&i.filled||(t.selected=!0,t.incorrect=!1),i.send(t).then(()=>{if(this.sendMessage(),!i.filled&&i.settings.requiredAnswer)return s.quiet||this.sendMessage(this._engageform.texts.ANSWER_REQUIRED_TO_PROCEED),t;{let e=t?i.settings.showCorrectAnswer||i.settings.showResults?1e3:200:0;return this.waitingForPageChange=re.$timeout(()=>(this.waitingForPageChange=null,this.move(t),t),e),this.waitingForPageChange}}).catch(e=>(s.quiet||this.sendMessage(this._engageform.texts[e.textKey]||e.message),e))}move(e){this._engageform.event.trigger("form::pageWillChange",{currentPosition:this.position,isStartPage:Boolean(0===this.position&&this._engageform.startPages.length)}),this.position++,this._engageform.availablePages.length>=this.position?(this.updateDistance(),this._engageform.setCurrent(this._engageform.availablePages[this.position-1]),this.hasPrev=!0,this.hasNext=!1,this.hasFinish=!1,this._engageform.availablePages.length>this.position?this.hasNext=!0:this._engageform.availablePages.length===this.position&&(this.hasFinish=this._engageform.isNormalMode()&&!(this._engageform.isType(l.Poll)&&!this._engageform.hasForms))):(this.position=this._engageform.availablePages.length,e||this._engageform.setCurrentEndPage().then(()=>{this.enabled=!1,this.hasPrev=!1,this.hasNext=!1,this.hasFinish=!1}).catch(e=>{e.data.msg&&this.sendMessage(e.data.msg)}))}disableDefaultAction(e){e&&(e.stopPropagation(),e.preventDefault())}sendMessage(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this._engageform.message=e,re.$timeout(()=>{this._engageform.message=""},this._engageform.settings.hideMessageAfterDelay)}}let p,b;function v(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}!function(e){e[e.Undefined=0]="Undefined",e[e.EndPage=1]="EndPage",e[e.Form=2]="Form",e[e.MultiChoice=3]="MultiChoice",e[e.PictureChoice=4]="PictureChoice",e[e.Rateit=5]="Rateit",e[e.StartPage=6]="StartPage",e[e.Poster=7]="Poster",e[e.SummaryPage=8]="SummaryPage"}(p||(p={}));class w{constructor(e){v(this,"showResults",!1),v(this,"showCorrectAnswer",!1),v(this,"showMainMedia",!1),v(this,"showDescription",!1),v(this,"requiredAnswer",!1),this.requiredAnswer=!!e.requiredAnswer,e.settings&&(this.showResults=!!e.settings.showAnswers,this.showCorrectAnswer=!!e.settings.showCorrectAnswer,this.showMainMedia=!!e.settings.showMainMedia,this.showDescription=!!e.settings.showDescription)}}function P(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class y{constructor(e,t){P(this,"id",void 0),P(this,"engageform",void 0),P(this,"type",p.Undefined),P(this,"title",""),P(this,"description",""),P(this,"media",""),P(this,"mediaWidth",0),P(this,"mediaHeight",0),P(this,"filled",!1),P(this,"settings",void 0),P(this,"cases",[]),P(this,"result",void 0),this.id=t._id,this.engageform=e,this.settings=new w(t),this.title=t.text||"",this.settings.showDescription&&(this.description=t.description||""),this.settings.showMainMedia&&t.imageData&&(this.media=re.cloudinary.prepareImageUrl(t.imageFile,680,t.imageData),this.mediaWidth=680,t.imageData.containerRatio?this.mediaHeight=Math.round(680*t.imageData.containerRatio):this.mediaHeight=Math.round(t.imageData.containerHeight||0))}send(e){if(!1===this.engageform.enabled)return re.$q.reject("Engageform already ended.");if(e)return e.send();{let e=re.$q.defer();return e.resolve(),e.promise}}sent(){const e=re.$q.defer();let t={};return t=re.localStorage.get("page."+this.id)||{},this.settings.showResults&&t.results?this.getStatsById(this.id).then(s=>{e.resolve(this.refreshAnswer(t,s))}).catch(()=>{e.resolve(t)}):e.resolve(t),e.promise}refreshAnswer(e,t){return e}selectAnswer(e){}createCase(e,t){}setResults(e){let t=this.cases.map(t=>(t.result=Number(e.stats&&e.stats[t.id])||0,t.id));for(let s in e.stats)if(-1===t.indexOf(s)&&"questionId"!==s&&this.type!==p.Rateit){let t=this.createCase({text:"[Removed answer]",_id:s,imageData:{height:100}});t.result=Number(e.stats[t.id]),this.cases.push(t)}}updateAnswers(e){this.id===e.questionId&&(this.engageform.current&&!Object(i.isUndefined)(e.avg)&&(this.engageform.current.result=e.avg),re.$timeout(()=>{this.cases.map(t=>{if(!Object(i.isUndefined)(e[t.id])){const s=t.load();s.results&&(s.results[t.id]=e[t.id],t.save(s)),t.result=e[t.id]||0}})}))}getStatsById(e){let t=re.config.backend.domain+re.getConfig("engageform").pageStatsUrl;return t=t.replace(":pageId",e),re.$http.get(t).then(e=>-1!==[200,304].indexOf(e.status)?e.data:re.$q.reject(e))}}function C(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}P(y,"Type",p);class _ extends y{constructor(e,t,s){super(e,t),C(this,"type",p.EndPage),C(this,"isCoverPage",!0),C(this,"button",void 0),C(this,"outcome",void 0),C(this,"social",void 0),C(this,"score",void 0),C(this,"rangeMin",void 0),C(this,"rangeMax",void 0),C(this,"exitLink",void 0),C(this,"link",void 0),C(this,"socialData",void 0);const r=Object(i.defaults)({},s.share,{title:"",description:"",link:"",imageUrl:""});r.imageUrl&&(r.imageUrl=re.cloudinary.preparePreviewImageUrl(r.imageUrl,680)),this.socialData=r,t.coverPage&&(this.button=t.coverPage.buttonText,this.outcome=t.coverPage.outcome,this.social=t.coverPage.showSocialShares,this.exitLink=t.coverPage.exitLink,this.link=t.coverPage.link,t.coverPage.scoreRange&&(this.rangeMax=t.coverPage.scoreRange.max,this.rangeMin=t.coverPage.scoreRange.min))}personalizeShares(){"outcome"!==this.engageform.typeName&&"score"!==this.engageform.typeName||(this.socialData.title=this.engageform.texts.SCORE_AND_OUTCOME_SHARE.replace(/\$RESULT\$/gi,this.outcome||String(this.score||0)).replace(/\$TITLE\$/gi,this.engageform.title),this.media&&this.settings.showMainMedia&&(this.socialData.imageUrl=this.media))}get fbLink(){return re.getConfig("backend")&&re.getConfig("backend").domain&&re.getConfig("share")&&re.getConfig("share").facebook&&this.socialData&&this.socialData.title&&this.socialData.description&&this.socialData.imageUrl&&this.engageform&&this.engageform.id?(this.personalizeShares(),re.getConfig("backend").domain+re.getConfig("share").facebook+"?quizId="+this.engageform.id+"&description="+encodeURIComponent(this.socialData.description)+"&name="+encodeURIComponent(this.socialData.title)+"&image="+this.socialData.imageUrl):null}get twLink(){return this.socialData&&this.socialData.title&&this.socialData.link?(this.personalizeShares(),"https://twitter.com/intent/tweet?text="+encodeURIComponent(this.socialData.title)+" "+this.socialData.link+" via @4screens"):null}}function I(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}!function(e){e[e.Undefined=0]="Undefined",e[e.Image=1]="Image",e[e.Input=2]="Input",e[e.Iteration=3]="Iteration",e[e.Text=4]="Text"}(b||(b={}));class x{constructor(e,t){let s=t._id;this.page=e,I(this,"id",void 0),I(this,"type",b.Undefined),I(this,"selected",!1),I(this,"correct",!1),I(this,"incorrect",!1),I(this,"result",0),I(this,"title",void 0),I(this,"error",void 0),I(this,"value",void 0),this.id=s}shouldShowIndicator(){return!this.page.engageform.isSummaryMode()&&!this.page.engageform.isResultsMode()&&this.page.settings.showCorrectAnswer&&(this.selected||this.page.filled&&this.correct)}shouldShowResults(){return this.page.engageform.isSummaryMode()||this.page.settings.showResults&&this.page.filled&&!this.page.engageform.isResultsMode()}send(){const e=re.$q.defer();return e.resolve({}),e.promise}makeSend(e){let t=re.getConfig("backend").domain+re.getConfig("engageform").pageResponseUrl;t=t.replace(":pageId",this.page.id),re.mode!==o.Default&&(t+="?preview"),e.quizQuestionId=this.page.id,e.userIdent=re.user.sessionId;const s={questionId:this.page.id,questionTitle:this.page.title,answerId:this.id,answerValue:e.inputs&&e.inputs.map(e=>e.value)||this.title||this.ordinal};return re.$http.post(t,e).then(t=>-1!==[200,304].indexOf(t.status)?(!e.userIdent&&t.data.userIdent&&(re.user.sessionId=t.data.userIdent),this.page.engageform.event.trigger("answer",s),t.data):re.$q.reject(t.data||{})).catch(e=>re.$q.reject(e.data||{}))}load(){return re.localStorage.get("page."+this.page.id)||{}}save(e){re.localStorage.set("page."+this.page.id,e)}validate(){return!0}}function k(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class S extends x{constructor(e,t){super(e,t),k(this,"type",b.Input),k(this,"expectedValue",void 0),k(this,"value",""),this.title=t.label,this.expectedValue=t.type}send(){const e={inputs:[]},t=this.load();for(const s in t)t.hasOwnProperty(s)&&e.inputs.push({_id:s,value:t[s]});return super.makeSend(e).then(()=>e).catch(e=>(406===e.code&&(e.textKey="INCORRECT_INPUT",e.message="Incorrect inputs sent. Try again.",this.save({})),re.$q.reject(e)))}validate(){if(this.correct=!1,this.incorrect=!1,this.page.settings.requiredAnswer&&!this.value?(this.error="Answer is required",this.incorrect=!0):(this.error="",this.correct=!0),this.correct){const e=this.load();return e[this.id]=this.value,this.save(e),!0}return!1}}function A(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class O extends y{constructor(e,t){super(e,t),A(this,"type",p.Form),A(this,"count",0),t.forms&&(this.cases=t.forms.inputs.map(e=>this.createCase(e)),this.cases.length&&this.sent().then(e=>{this.selectAnswer(e)}))}createCase(e){return new S(this,e)}send(e){var t=re.$q.defer(),s=!0;return this.cases.map(e=>{e.validate()||(s=!1)}),s?(this.filled=!0,this.engageform.sendAnswerCallback(this.engageform.title||this.engageform.id,this.engageform.current?this.engageform.current.title||this.engageform.current.id:null,this.cases[0]),t.resolve(this.cases[0].send())):(this.filled=!1,t.resolve({})),t.promise}selectAnswer(e){this.cases.map(t=>{t.value=e[t.id]||"",e.inputs&&e.inputs.forEach(e=>{e._id===t.id&&(t.value=e.value)})})}setResults(e){this.count=e.count||0}}class j extends x{constructor(e,t){var s,i,r;super(e,t),s=this,i="type",r=b.Text,i in s?Object.defineProperty(s,i,{value:r,enumerable:!0,configurable:!0,writable:!0}):s[i]=r,this.title=t.text}send(){return!this.page.engageform.settings.allowAnswerChange&&this.page.filled?re.$q.reject({textKey:"CHANGING_NOT_ALLOWED",message:"Changing answer is not allowed"}):super.makeSend({selectedAnswerId:this.id}).then(e=>{const t={};e.selectedAnswerId&&(t.selectedCaseId=e.selectedAnswerId),e.correctAnswerId&&(t.correctCaseId=e.correctAnswerId);for(const s in e.stats)e.stats.hasOwnProperty(s)&&(t.results=t.results||{},/.{24}/.test(s)&&(t.results[s]=e.stats[s]));return super.save(t),this.page.selectAnswer(t),t})}}class T extends y{constructor(e,t){var s,i,r;super(e,t),s=this,i="type",r=p.MultiChoice,i in s?Object.defineProperty(s,i,{value:r,enumerable:!0,configurable:!0,writable:!0}):s[i]=r,t.answers&&(this.cases=t.answers.map(e=>this.createCase(e)),this.cases.length&&this.sent().then(e=>{this.selectAnswer(e)}))}createCase(e){return new j(this,e)}refreshAnswer(e,t){return t.answers.map(t=>{e.results&&(e.results[t._id]=t.percent)}),e}selectAnswer(e){this.cases.map(t=>{t.selected=!1,t.correct=!1,t.incorrect=!1,t.id===e.selectedCaseId&&(this.engageform.sendAnswerCallback(this.engageform.title||this.engageform.id,this.engageform.current?this.engageform.current.title||this.engageform.current.id:null,t),this.filled=!0,t.selected=!0),e.results&&(t.result=e.results[t.id]||0),t.id===e.correctCaseId?t.correct=!0:t.incorrect=!0})}}function D(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class U extends x{constructor(e,t){super(e,t),D(this,"type",b.Image),D(this,"media",void 0),D(this,"mediaWidth",void 0),D(this,"mediaHeight",void 0),this.title=t.text,this.media=re.cloudinary.prepareImageUrl(t.imageFile,U.mediaWidth,t.imageData),this.mediaWidth=U.mediaWidth,t.imageData&&t.imageData.containerRatio?this.mediaHeight=Math.round(U.mediaWidth*t.imageData.containerRatio):this.mediaHeight=Math.round(t.imageData.containerHeight||0)}send(){return!this.page.engageform.settings.allowAnswerChange&&this.page.filled?re.$q.reject({textKey:"CHANGING_NOT_ALLOWED",message:"Changing answer is not allowed"}):super.makeSend({selectedAnswerId:this.id}).then(e=>{const t={selectedCaseId:e.selectedAnswerId,correctCaseId:e.correctAnswerId};for(const s in e.stats)e.stats.hasOwnProperty(s)&&(t.results=t.results||{},/.{24}/.test(s)&&(t.results[s]=e.stats[s]));return super.save(t),this.page.selectAnswer(t),t})}}D(U,"mediaWidth",300);class q extends y{constructor(e,t){var s,i,r;super(e,t),s=this,i="type",r=p.PictureChoice,i in s?Object.defineProperty(s,i,{value:r,enumerable:!0,configurable:!0,writable:!0}):s[i]=r,t.answers&&(this.cases=t.answers.map(e=>this.createCase(e)),this.cases.length&&this.sent().then(e=>{this.selectAnswer(e)}))}createCase(e){return new U(this,e)}refreshAnswer(e,t){return t.answers.map(t=>{e.results&&(e.results[t._id]=t.percent)}),e}selectAnswer(e){this.cases.map(t=>{t.selected=!1,t.correct=!1,t.incorrect=!1,t.id===e.selectedCaseId&&(this.engageform.sendAnswerCallback(this.engageform.title||this.engageform.id,this.engageform.current?this.engageform.current.title||this.engageform.current.id:null,t),this.filled=!0,t.selected=!0),e.results&&(t.result=e.results[t.id]||0),t.id===e.correctCaseId?t.correct=!0:t.incorrect=!0})}}function M(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class R extends y{constructor(e,t){super(e,t),M(this,"type",p.Poster),M(this,"button",void 0),M(this,"exitLink",void 0),M(this,"link",void 0),t.coverPage&&(this.button=t.coverPage.buttonText,this.exitLink=t.coverPage.exitLink,this.link=t.coverPage.link)}}function E(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class $ extends x{constructor(e,t){super(e,function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{},i=Object.keys(s);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(s).filter(function(e){return Object.getOwnPropertyDescriptor(s,e).enumerable}))),i.forEach(function(t){E(e,t,s[t])})}return e}({},t,{_id:""})),E(this,"type",b.Iteration),E(this,"symbol",void 0),E(this,"ordinal",void 0),this.ordinal=t.ordinal,this.symbol=t.symbol}send(){return!this.page.engageform.settings.allowAnswerChange&&this.page.filled?re.$q.reject({textKey:"CHANGING_NOT_ALLOWED",message:"Changing answer is not allowed"}):super.makeSend({quizQuestionId:this.page.id,rateItValue:this.ordinal}).then(e=>{const t={};return e.selectedValue&&(t.selectedValue=e.selectedValue),e.avgRateItValue&&(t.result=+e.avgRateItValue),super.save(t),this.page.selectAnswer(t),t})}}function F(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class N extends y{shouldShowResults(){return this.settings.showResults&&this.result>0}constructor(e,t){super(e,t),F(this,"type",p.Rateit),F(this,"result",0),F(this,"labelMin",void 0),F(this,"labelMax",void 0),F(this,"selectedValue",0),this.labelMin=t.rateIt.minLabel,this.labelMax=t.rateIt.maxLabel,this.cases=Array.apply(null,Array(t.rateIt.maxRateItValue)).map((e,s)=>this.createCase(s+1,t.rateIt.rateType)),this.sent().then(e=>{e.selectedValue&&(this.selectedValue=e.selectedValue,this.selectAnswer(e))})}createCase(e,t){return new $(this,{ordinal:e,symbol:t})}selectAnswer(e){e.selectedValue&&(this.filled=!0,this.selectedValue=e.selectedValue),e.result&&(this.result=e.result),this.cases.map(t=>{t.selected=e.selectedValue>=t.ordinal,e.selectedValue===t.ordinal&&this.engageform.sendAnswerCallback(this.engageform.title||this.engageform.id,this.engageform.current?this.engageform.current.title||this.engageform.current.id:null,t)})}setResults(e){this.result=e.average||0,this.selectedValue=e.average||0}}function L(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class B extends y{constructor(e,t){super(e,t),L(this,"type",p.StartPage),L(this,"isCoverPage",!0),L(this,"button",void 0),t.coverPage&&void 0!==t.coverPage.buttonText&&(this.button=t.coverPage.buttonText)}}function V(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class z extends y{constructor(e,t){super(e,t),V(this,"type",p.SummaryPage),V(this,"stats",void 0),t.text?this.title=t.text:e.type===l.Outcome?this.title="Outcomes":this.title="Scores",this.stats=t.stats}}function W(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class H{constructor(e){W(this,"allowAnswerChange",!1),W(this,"hideMessageAfterDelay",3e3),W(this,"share",void 0),W(this,"tracking",void 0),e.settings&&(this.allowAnswerChange=!!e.settings.allowAnswerChange,this.tracking=e.settings.tracking,e.settings.hideMessageAfterDelay&&(this.hideMessageAfterDelay=e.settings.hideMessageAfterDelay),e.settings.share&&(this.share=e.settings.share,!this.share.imageUrl&&re.getConfig("share")&&re.getConfig("share").defaultImgUrl&&(this.share.imageUrl=re.getConfig("share").defaultImgUrl)))}}function K(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class G{constructor(e){K(this,"liveTitle","Live"),K(this,"chatTitle","Chat"),K(this,"logoUrl",""),K(this,"headerText",""),e.tabs&&(e.tabs.liveTitle&&(this.liveTitle=e.tabs.liveTitle),e.tabs.chatTitle&&(this.chatTitle=e.tabs.chatTitle),e.tabs.logoUrl&&(this.logoUrl=re.getConfig("backend").api+re.getConfig("backend").imagesUrl+"/"+e.tabs.logoUrl),e.tabs.headerText&&(this.headerText=e.tabs.headerText))}}function Q(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class J{constructor(e,t){Q(this,"answerBackgroundColor",""),Q(this,"answerBorderColor",""),Q(this,"answerColor",""),Q(this,"backgroundBrightness",""),Q(this,"backgroundColor",""),Q(this,"backgroundImageBlur",""),Q(this,"backgroundImageFile",""),Q(this,"backgroundImagePosition",""),Q(this,"buttonColor",""),Q(this,"font",""),Q(this,"questionColor",""),Q(this,"customThemeCssFile",""),Q(this,"backgroundImageConvertedFile",""),Q(this,"tabBorderColor",""),Q(this,"tabFontColor",""),Q(this,"tabColor",""),Q(this,"embedSettings",void 0),this.embedSettings=t,e.theme&&(this.answerBackgroundColor=e.theme.answerBackgroundColor||"",this.answerBorderColor=e.theme.answerBorderColor||"",this.answerColor=e.theme.answerColor||"",this.backgroundBrightness=e.theme.backgroundBrightness||"",this.backgroundColor=e.theme.backgroundColor||"",this.backgroundImageBlur=e.theme.backgroundImageBlur||"",this.backgroundImageFile=e.theme.backgroundImageFile||"",this.backgroundImagePosition=e.theme.backgroundImagePosition||"",this.buttonColor=e.theme.buttonColor||"",this.font=e.theme.font||"",this.questionColor=e.theme.questionColor||"",this.tabColor=e.theme.tabColor||"",this.tabFontColor=e.theme.tabFontColor||"",this.tabBorderColor=e.theme.tabBorderColor||"",e.theme.customThemeCssFile&&(this.customThemeCssFile=re.config.backend.api+"/uploads/"+e.theme.customThemeCssFile),e.theme.backgroundImageFile&&this.convertBackgroundImage())}convertBackgroundImage(){this.backgroundImageConvertedFile=re.cloudinary.prepareBackgroundImageUrl(this.backgroundImageFile,window.innerWidth,"auto"===this.embedSettings.height?null:window.innerHeight,parseInt(this.backgroundImageBlur,10),this.backgroundImagePosition)}}function X(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class Y{get id(){return this._engageformId}get pages(){return this._pages}get startPages(){return this._startPages}get endPages(){return this._endPages}get availablePages(){return this._availablePages}get typeName(){return l[this.type].toLowerCase()}get hasForms(){return this._hasForms}isType(e){return this.type===e}isNormalMode(){return Boolean(this.mode===o.Default||this.mode===o.Preview)}isSummaryMode(){return Boolean(this.mode===o.Summary)}isResultsMode(){return Boolean(this.mode===o.Result)}isPreviewMode(){return Boolean(this.mode===o.Preview)}constructor(e,t,s,i){let r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:()=>{};X(this,"_engageformId",void 0),X(this,"_pages",{}),X(this,"_startPages",[]),X(this,"_endPages",[]),X(this,"_availablePages",[]),X(this,"_hasForms",!1),X(this,"sendAnswerCallback",void 0),X(this,"enabled",!0),X(this,"type",l.Undefined),X(this,"title",void 0),X(this,"message",void 0),X(this,"settings",void 0),X(this,"theme",void 0),X(this,"branding",void 0),X(this,"tabs",void 0),X(this,"themeType",void 0),X(this,"embedSettings",void 0),X(this,"texts",void 0),X(this,"current",void 0),X(this,"navigation",void 0),X(this,"meta",void 0),X(this,"event",void 0),X(this,"mode",void 0),this._engageformId=e._id,this.mode=t,this.embedSettings=i,this.sendAnswerCallback=r,this.title=e.title,this.settings=new H(e),this.theme=new J(e,i),this.tabs=new G(e),this.texts=e.texts,this.themeType=this.getThemeType(e.theme.backgroundColor),this.event=new u,this.branding=g.create(e.settings&&e.settings.branding);let a=this.buildPages(s||[],this.settings);a.forEach(e=>this.storePage(e)),this._hasForms=a.some(e=>e.type===p.Form),this.navigation=f.fromEnageform(this),this.meta=d.fromEngageform(this)}setUserIdent(e){re.user.sessionId=e}getUserIdent(e){return re.user.sessionId}storePage(e){return e.type===p.StartPage?this.isNormalMode()&&this._startPages.push(e.id):e.type===p.EndPage?this.isNormalMode()&&this._endPages.push(e.id):this._availablePages.push(e.id),this._pages[e.id]=e,e}initPage(e){return this.storePage(this.buildPages([e],this.settings)[0]),this.setCurrent(e._id)}setCurrent(e){let t=this._pages[e];return this.current=t,t}setCurrentEndPage(){var e=re.config.backend.domain+re.getConfig("engageform").engageformFinishUrl;return e=e.replace(":engageformId",this._engageformId),re.mode!==o.Default&&(e+="?preview"),re.$http.post(e,{userIdent:re.user.sessionId,globalUserIdent:re.user.id}).then(e=>-1!==[200,304].indexOf(e.status)?(re.localStorage.clearAll(),re.user.id=e.data.globalUserIdent,e.data):re.$q.reject(e))}cleanPages(){this._availablePages.length=0,this._pages={}}buildPages(e,t){return e.map(e=>this.createPage(e,t)).filter(e=>Boolean(e))}createPage(e,t){switch(e.type){case p.EndPage:return new _(this,e,t);case p.Form:return new O(this,e);case p.MultiChoice:return new T(this,e);case p.PictureChoice:return new q(this,e);case p.Rateit:return new N(this,e);case p.StartPage:return new B(this,e);case p.Poster:return new R(this,e);default:throw new Error("Trying to construct an unknown page.")}}setSummary(e){e.forEach(e=>{e.stats&&this._pages[e.stats.questionId]&&this._pages[e.stats.questionId].setResults(e)})}setAnswers(e){let t=e.questions;for(let e in t)if(this._pages[e]){let s=t[e];this._pages[e].selectAnswer({selectedCaseId:s.selectedAnswerId,inputs:s.inputs,selectedValue:s.rateItValue})}}setResultPage(e){const t={_id:"summaryPage",type:p.SummaryPage,settings:{showCorrectAnswer:!0},stats:e},s=new z(this,t);this.storePage(s)}setUserResultPage(e){const t={_id:"RESULT_PAGE",type:"summaryPage",settings:{}};"outcome"===e.type?Object(i.extend)(t,{text:"User's outcome: "+e.outcome}):Object(i.extend)(t,{text:"User's score: "+e.score+" / "+e.maxScore});const s=new z(this,t);this.storePage(s)}getThemeType(e){const t=this.colorToRgb(e);return.299*t.red+.587*t.green+.114*t.blue>186?"light":"dark"}colorToRgb(e){let t;if("#"===e[0])e=e.substr(1);else{const t=e.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);e=t&&4===t.length?("0"+parseInt(t[1],10).toString(16)).slice(-2)+("0"+parseInt(t[2],10).toString(16)).slice(-2)+("0"+parseInt(t[3],10).toString(16)).slice(-2):""}if(3===e.length){let t=e;e="",t=(t=/^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(t)).slice(1);for(let s=0;s<3;s++)e+=t[s]+t[s]}if(!(t=/^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(e)))throw new Error("Invalid color.");return t=t.slice(1),{red:parseInt(t[0],16),green:parseInt(t[1],16),blue:parseInt(t[2],16)}}}function Z(e,t){return Object(i.includes)(Object(i.values)(e),t)}function ee(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}class te{static create(){return new te}get id(){return this._id||(this._id=re.localStorage.get(te.idKey)),this._id}set id(e){re.localStorage.set(te.idKey,e),this._id=e}get sessionId(){return this._sessionId||(this._sessionId=re.localStorage.get(te.sessionIdKey)),this._sessionId}set sessionId(e){re.localStorage.set(te.sessionIdKey,e),this._sessionId=e}constructor(){ee(this,"_id",null),ee(this,"_sessionId",null)}}function se(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var s=[],i=!0,r=!1,a=void 0;try{for(var n,o=e[Symbol.iterator]();!(i=(n=o.next()).done)&&(s.push(n.value),!t||s.length!==t);i=!0);}catch(e){r=!0,a=e}finally{try{i||null==o.return||o.return()}finally{if(r)throw a}}return s}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function ie(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}ee(te,"idKey","userIdent"),ee(te,"sessionIdKey","sessionIdent"),s.d(t,"default",function(){return re});class re{static getConfig(e){return re.config[e]}constructor(e,t,s,i,r,a){ie(this,"_engageform",void 0),ie(this,"_event",void 0),re.$http=e,re.$q=t,re.$timeout=s,re.cloudinary=i,re.localStorage=r,re.config=a,this._event=new u,re.cloudinary.setConfig(a.cloudinary)}get type(){return this._engageform?this._engageform.type:l.Undefined}get Type(){return l}get mode(){return re.mode}get Mode(){return o}get title(){if(this._engageform)return this._engageform.title}get theme(){if(this._engageform)return this._engageform.theme}get current(){if(this._engageform)return this._engageform.current}get navigation(){if(this._engageform)return this._engageform.navigation}get branding(){if(this._engageform)return this._engageform.branding}get message(){if(this._engageform)return this._engageform.message}get meta(){if(this._engageform)return this._engageform.meta}get event(){if(this._event)return this._event}init(e){const t=Object(i.defaults)({},e,{mode:o.Default});if(!t||!t.id)return re.$q.reject({status:"error",error:{code:406,message:"The required id property does not exist."},data:t});if(re._instances[t.id])return re._instances[t.id];if(!Z(o,t.mode))return re.$q.reject({status:"error",error:{code:406,message:"Mode property not supported."},data:t});re.mode=t.mode;let s=[re.getData("quiz",t.id),t.live?re.$q.resolve([]):re.getData("pages",t.id)];return re.$q.all(s).then(e=>{let s=se(e,2),i=s[0],a=s[1];return Z(r,i.type)?(this._engageform=new re.quizzesConstructors[i.type](i,re.mode,a,t.embedSettings,t.callback?t.callback.sendAnswerCallback:()=>{}),this._engageform):re.$q.reject({status:"error",error:{code:406,message:"Type property not supported."},data:i})})}static getData(e,t){if("quiz"!==e&&"pages"!==e)throw new Error(`Resource path for ${e} type of data is unknown.`);let s=re.getConfig("backend").domain+e==="quiz"?re.getConfig("engageform").engageformUrl:re.getConfig("engageform").engageformPagesUrl;return s=s.replace(":engageformId",t),re.mode!==o.Default&&(s+="?preview"),re.$http.get(s).then(e=>-1!==[200,304].indexOf(e.status)?e.data:re.$q.reject(e))}destroyInstances(){re._instances={}}}ie(re,"user",te.create()),ie(re,"$http",void 0),ie(re,"$q",void 0),ie(re,"$timeout",void 0),ie(re,"cloudinary",void 0),ie(re,"localStorage",void 0),ie(re,"config",void 0),ie(re,"mode",o.Undefined),ie(re,"_instances",{}),ie(re,"quizzesConstructors",{outcome:class extends Y{constructor(){var e,t,s;super(...arguments),e=this,t="type",s=l.Outcome,t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s}setCurrentEndPage(){return super.setCurrentEndPage().then(e=>{let t=!1;return this.endPages.map(s=>{this.pages[s].outcome===e.outcome&&(t=!0,this.setCurrent(s))}),t||(this.enabled=!1,this.message="Thank you!"),e})}},poll:class extends Y{constructor(){var e,t,s;super(...arguments),e=this,t="type",s=l.Poll,t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s}setCurrentEndPage(){return super.setCurrentEndPage().then(e=>(this.endPages.length?this.setCurrent(this.endPages[0]):(this.enabled=!1,this.message="Thank you!"),e))}},score:class extends Y{constructor(){var e,t,s;super(...arguments),e=this,t="type",s=l.Score,t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s}setCurrentEndPage(){return super.setCurrentEndPage().then(e=>{let t=100,s=!1;return e.maxScore>0&&(t=Math.round(e.totalScore/e.maxScore*100)),this.endPages.map(e=>{const i=this.pages[e],r=i.rangeMin,a=void 0===r?0:r,n=i.rangeMax;a<=t&&(void 0===n?0:n)>=t&&(s=!0,i.score=t,this.setCurrent(e))}),s||(this.enabled=!1,this.message="Thank you!"),e})}},survey:class extends Y{constructor(){var e,t,s;super(...arguments),e=this,t="type",s=l.Survey,t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s}setCurrentEndPage(){return super.setCurrentEndPage().then(e=>(this.endPages.length?this.setCurrent(this.endPages[0]):(this.enabled=!1,this.message="Thank you!"),e))}},live:class extends Y{constructor(){var e,t,s;super(...arguments),e=this,t="type",s=l.Live,t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s}initPages(){const e=re.$q.defer();return e.resolve(this),e.promise}initPage(e){return this.cleanPages(),super.initPage(e)}setCurrentEndPage(){const e=re.$q.defer();return e.resolve(),e.promise}}}),re.$inject=["$http","$q","$timeout","cloudinary","localStorageService","AppConfig"],n.service("Engageform",re)}]);