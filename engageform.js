(function(angular) {
/*!
 * 4screens-angular-engageform v0.2.61
 * (c) 2015 Nopattern sp. z o.o.
 * License: proprietary
 */

var Engageform;
(function (Engageform) {
    (function (Type) {
        Type[Type["Undefined"] = 0] = "Undefined";
        Type[Type["Live"] = 1] = "Live";
        Type[Type["Outcome"] = 2] = "Outcome";
        Type[Type["Poll"] = 3] = "Poll";
        Type[Type["Score"] = 4] = "Score";
        Type[Type["Survey"] = 5] = "Survey";
    })(Engageform.Type || (Engageform.Type = {}));
    var Type = Engageform.Type;
    (function (Mode) {
        Mode[Mode["Undefined"] = 0] = "Undefined";
        Mode[Mode["Default"] = 1] = "Default";
        Mode[Mode["Preview"] = 2] = "Preview";
        Mode[Mode["Result"] = 3] = "Result";
        Mode[Mode["Summary"] = 4] = "Summary";
    })(Engageform.Mode || (Engageform.Mode = {}));
    var Mode = Engageform.Mode;
})(Engageform || (Engageform = {}));

var Page;
(function (Page) {
    (function (CaseType) {
        CaseType[CaseType["Undefined"] = 0] = "Undefined";
        CaseType[CaseType["Image"] = 1] = "Image";
        CaseType[CaseType["Input"] = 2] = "Input";
        CaseType[CaseType["Iteration"] = 3] = "Iteration";
        CaseType[CaseType["Text"] = 4] = "Text";
        CaseType[CaseType["Buzz"] = 5] = "Buzz";
    })(Page.CaseType || (Page.CaseType = {}));
    var CaseType = Page.CaseType;
    (function (Type) {
        Type[Type["Undefined"] = 0] = "Undefined";
        Type[Type["EndPage"] = 1] = "EndPage";
        Type[Type["Form"] = 2] = "Form";
        Type[Type["MultiChoice"] = 3] = "MultiChoice";
        Type[Type["PictureChoice"] = 4] = "PictureChoice";
        Type[Type["Rateit"] = 5] = "Rateit";
        Type[Type["StartPage"] = 6] = "StartPage";
        Type[Type["Buzzer"] = 7] = "Buzzer";
        Type[Type["Poster"] = 8] = "Poster";
        Type[Type["SummaryPage"] = 9] = "SummaryPage";
    })(Page.Type || (Page.Type = {}));
    var Type = Page.Type;
})(Page || (Page = {}));

/// <reference path="../typings/tsd.d.ts" />
var app = angular.module('4screens.engageform', [
    '4screens.util.cloudinary',
    'LocalStorageModule'
]);

/// <reference path="inavigation.ts" />
var Navigation;
(function (Navigation_1) {
    var Navigation = (function () {
        function Navigation(engageform) {
            this.enabled = false;
            this.position = 0;
            this.size = 0;
            this.hasStart = false;
            this.enabledStart = true;
            this.hasPrev = false;
            this.enabledPrev = true;
            this.hasNext = false;
            this.enabledNext = true;
            this.hasFinish = false;
            this.enabledFinish = true;
            this.distance = 0;
            this.animate = 'swipeNext';
            this.hasStartPages = false;
            this.hasEndPages = false;
            this.next = this.pick;
            this.finish = this.pick;
            this._engageform = engageform;
            this.size = engageform.availablePages.length;
            this.hasEndPages = Boolean(this._engageform.endPages.length);
            if (this._engageform.startPages.length) {
                this.hasStart = true;
                this.hasStartPages = true;
                this._engageform.setCurrent(this._engageform.startPages[0]);
            }
            else {
                this.enabled = true;
                this.move(null);
                this.hasPrev = false;
            }
        }
        Navigation.prototype.updateDistance = function () {
            return this.distance = this.position / this.size;
        };
        Navigation.prototype.start = function ($event) {
            this.disableDefaultAction($event);
            this.animate = 'swipeNext';
            this.enabled = true;
            // FIXME: Why would you do that? щ(°Д°щ) But I'm not removing it. Hell knows what depends on this stupidity.
            this.hasStart = false;
            this.move(null);
            this.hasPrev = true;
        };
        /**
         * Clears the page change timeout.
         */
        Navigation.prototype.stopPageChange = function () {
            if (this.waitingForPageChange) {
                Bootstrap.$timeout.cancel(this.waitingForPageChange);
            }
        };
        Navigation.prototype.prev = function ($event) {
            this.disableDefaultAction($event);
            this.stopPageChange();
            this.animate = 'swipePrev';
            if (this._engageform.current) {
                this._engageform.message = '';
            }
            this.position--;
            this.updateDistance();
            this.hasNext = true;
            this.hasFinish = false;
            if (this.position === 0) {
                this._engageform.setCurrent(this._engageform.startPages[0]);
                this.hasPrev = false;
            }
            else {
                this._engageform.setCurrent(this._engageform.availablePages[this.position - 1]);
                this.hasPrev = this.position === 1 ? this.hasStartPages : true;
            }
        };
        Navigation.prototype.pick = function ($event, vcase, opts) {
            var _this = this;
            if (opts === void 0) { opts = { quiet: false }; }
            this.disableDefaultAction($event);
            this.stopPageChange();
            this.animate = 'swipeNext';
            // Move page but don't do anything else when the quiz is nor in a normal mode.
            if (!this._engageform.isNormalMode()) {
                var defer = Bootstrap.$q.defer();
                defer.resolve(vcase);
                this.move(vcase);
                return defer.promise;
            }
            var current = this._engageform.current;
            // Send the answer.
            return current.send(vcase).then(function () {
                _this.sendMessage();
                // Prevent the question change when there's no answer selected and the page requires it.
                if (!current.filled && current.settings.requiredAnswer) {
                    if (!opts.quiet) {
                        _this.sendMessage(_this._engageform.texts.ANSWER_REQUIRED_TO_PROCEED);
                    }
                    return vcase;
                }
                else {
                    // Change the page with a slight delay, or do it instantly.
                    var pageChangeDelay = vcase ? (current.settings.showCorrectAnswer || current.settings.showResults ? 2000 : 200) : 0;
                    // Schedule the page change.
                    _this.waitingForPageChange = Bootstrap.$timeout(function () {
                        _this.waitingForPageChange = null;
                        _this.move(vcase);
                        return vcase;
                    }, pageChangeDelay);
                    return _this.waitingForPageChange;
                }
            }).catch(function (data) {
                if (!opts.quiet) {
                    _this.sendMessage(_this._engageform.texts[data.textKey] || data.message);
                }
                return data;
            });
        };
        Navigation.prototype.move = function (vcase) {
            var _this = this;
            this._engageform.event.trigger('form::pageWillChange', {
                currentPosition: this.position,
                // You might wonder why I'm not using this.hasStart. Well, that's because some genius decided to
                // make it false on the navigation start so it can't be used.
                isStartPage: Boolean(this.position === 0 && this._engageform.startPages.length)
            });
            this.position++;
            if (this._engageform.availablePages.length >= this.position) {
                this.updateDistance();
                this._engageform.setCurrent(this._engageform.availablePages[this.position - 1]);
                this.hasPrev = true;
                this.hasNext = false;
                this.hasFinish = false;
                if (this._engageform.availablePages.length > this.position) {
                    this.hasNext = true;
                }
                else if (this._engageform.availablePages.length === this.position) {
                    // Finisher is not available when the engageform is of a type "poll" and doesn't have any form-type question.
                    // Also when it's not working in normal mode (ie. summary doesn't submit).
                    this.hasFinish = this._engageform.isNormalMode() &&
                        !(this._engageform.isType(Engageform.Type.Poll) && !this._engageform.hasForms);
                }
            }
            else {
                this.position = this._engageform.availablePages.length;
                if (!vcase) {
                    this._engageform.setCurrentEndPage().then(function () {
                        _this.enabled = false;
                        _this.hasPrev = false;
                        _this.hasNext = false;
                        _this.hasFinish = false;
                    }).catch(function (err) {
                        if (err.data.msg) {
                            _this.sendMessage(err.data.msg);
                        }
                    });
                }
            }
        };
        Navigation.prototype.disableDefaultAction = function ($event) {
            if ($event) {
                $event.stopPropagation();
                $event.preventDefault();
            }
        };
        Navigation.prototype.sendMessage = function (msg) {
            var _this = this;
            if (msg === void 0) { msg = ''; }
            this._engageform.message = msg;
            Bootstrap.$timeout(function () {
                _this._engageform.message = '';
            }, this._engageform.settings.hideMessageAfterDelay);
        };
        return Navigation;
    }());
    Navigation_1.Navigation = Navigation;
})(Navigation || (Navigation = {}));

/// <reference path="imeta.ts" />
var Meta;
(function (Meta_1) {
    var Meta = (function () {
        function Meta(engageform) {
            this.globalTitle = '';
            this.globalDescription = '';
            this._engageform = engageform;
            if (this._engageform.settings.share) {
                this.globalTitle = this._engageform.settings.share.title || '';
                this.globalDescription = this._engageform.settings.share.description || '';
            }
            if (this._engageform.endPages.length < 1 || !_.find(this._engageform.pages, { social: true })) {
                if (this._engageform.startPages.length && this._engageform.pages[this._engageform.startPages[0]].title) {
                    this.globalTitle = this._engageform.pages[this._engageform.startPages[0]].title;
                    this.globalDescription = this._engageform.pages[this._engageform.startPages[0]].description;
                }
                else {
                    this.globalTitle = '';
                    this.globalDescription = '';
                }
            }
        }
        return Meta;
    }());
    Meta_1.Meta = Meta;
})(Meta || (Meta = {}));

/// <reference path="ipage.ts" />
/// <reference path="ipages.ts" />
/// <reference path="ipagesent.ts" />
var Page;
(function (Page_1) {
    var Page = (function () {
        function Page(engageform, data) {
            this.title = '';
            this.description = '';
            this.media = '';
            this.cases = [];
            this._pageId = data._id;
            this._engageform = engageform;
            this.settings = new Page_1.Settings(data);
            this.title = data.text || '';
            if (this.settings.showDescription) {
                this.description = data.description || '';
            }
            if (this.settings.showMainMedia && data.imageData) {
                this.media = Bootstrap.cloudinary.prepareImageUrl(data.imageFile, 680, // zakładamy że media zawsze ma taką szerokość (MUST BE FIXXXXXED!!!!!)
                data.imageData);
                this.mediaWidth = 680;
                if (data.imageData.containerRatio) {
                    this.mediaHeight = Math.round(680 * data.imageData.containerRatio);
                }
                else {
                    this.mediaHeight = Math.round(data.imageData.containerHeight || 0);
                }
            }
        }
        Object.defineProperty(Page.prototype, "id", {
            get: function () {
                return this._pageId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Page.prototype, "engageform", {
            get: function () {
                return this._engageform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Page.prototype, "Type", {
            get: function () {
                return Page_1.Type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Page.prototype, "CaseType", {
            get: function () {
                return Page_1.CaseType;
            },
            enumerable: true,
            configurable: true
        });
        Page.prototype.send = function (vcase) {
            if (this._engageform.enabled === false) {
                return Bootstrap.$q.reject('Engageform already ended.');
            }
            if (vcase) {
                return vcase.send();
            }
            else {
                var deferred = Bootstrap.$q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        Page.prototype.sent = function () {
            var _this = this;
            var deferred = Bootstrap.$q.defer();
            var sent = {};
            sent = (Bootstrap.localStorage.get('page.' + this.id) || {});
            if (this.settings.showResults && sent.results) {
                this.getStatsById(this.id).then(function (data) {
                    deferred.resolve(_this.refreshAnswer(sent, data));
                }).catch(function () {
                    deferred.resolve(sent);
                });
            }
            else {
                deferred.resolve(sent);
            }
            return deferred.promise;
        };
        Page.prototype.refreshAnswer = function (sent, question) {
            // "abstract"
            return sent;
        };
        Page.prototype.selectAnswer = function (data) {
            // "abstract"
        };
        Page.prototype.createCase = function (data, symbol) {
            // "abstract
            return;
        };
        /**
         * Sets the provided results on the page's cases.
         * @param results Object containing data with results that should be set on the cases.
         */
        Page.prototype.setResults = function (results) {
            var casesWithResults = this.cases.map(function (singleCase) {
                // Set's the result on the case. Side effect, but makes the whole method a bit faster. Otherwise there
                // would be a need for more loops when creating fake answers.
                singleCase.result = Number(results.stats[singleCase.id]) || 0;
                // Returns the ID of the case so there's no need to loop them later
                return singleCase.id;
            });
            // Create fake cases when there's a result but no answer for that.
            for (var k in results.stats) {
                if (casesWithResults.indexOf(k) === -1
                    && k !== 'questionId'
                    && this.type !== Page_1.Type.Rateit) {
                    // Create the fake answer to show results…
                    var fakeCase = this.createCase({
                        text: '[Removed answer]',
                        _id: k,
                        imageData: {
                            // Comes from the backend by default.
                            height: 100
                        }
                    });
                    // … and set those results…
                    fakeCase.result = Number(results.stats[fakeCase.id]);
                    // … and add them to the answers pool.
                    this.cases.push(fakeCase);
                }
            }
        };
        Page.prototype.updateAnswers = function (data) {
            var _this = this;
            if (this.id !== data.questionId) {
                return;
            }
            if (this.engageform.current && !_.isUndefined(data.avg)) {
                this.engageform.current.result = data.avg;
            }
            Bootstrap.$timeout(function () {
                _this.cases.map(function (vcase) {
                    if (!_.isUndefined(data[vcase.id])) {
                        var loaded = vcase.load();
                        if (loaded.results) {
                            loaded.results[vcase.id] = data[vcase.id];
                            vcase.save(loaded);
                        }
                        vcase.result = data[vcase.id] || 0;
                    }
                });
            });
        };
        Page.prototype.getStatsById = function (pageId) {
            var url = Bootstrap.config.backend.domain + Bootstrap.config.engageform.pageStatsUrl;
            url = url.replace(':pageId', pageId);
            return Bootstrap.$http.get(url).then(function (res) {
                if ([200, 304].indexOf(res.status) !== -1) {
                    return res.data;
                }
                return Bootstrap.$q.reject(res);
            });
        };
        return Page;
    }());
    Page_1.Page = Page;
})(Page || (Page = {}));

/// <reference path="iuser.ts" />
var User = (function () {
    function User() {
    }
    Object.defineProperty(User.prototype, "id", {
        get: function () {
            if (!this._id) {
                this._id = Bootstrap.localStorage.get('userIdent');
            }
            return this._id;
        },
        set: function (id) {
            Bootstrap.localStorage.set('userIdent', id);
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "sessionId", {
        get: function () {
            if (!this._sessionId) {
                this._sessionId = Bootstrap.localStorage.get('sessionIdent');
            }
            return this._sessionId;
        },
        set: function (sessionId) {
            Bootstrap.localStorage.set('sessionIdent', sessionId);
            this._sessionId = sessionId;
        },
        enumerable: true,
        configurable: true
    });
    return User;
}());

var Util;
(function (Util) {
    var Event = (function () {
        function Event() {
            this._listener = {};
        }
        /**
         * Register callback for given event.
         *
         * @param {String} event
         * @param {Function} callback
         */
        Event.prototype.listen = function (event, callback) {
            if (!this._listener[event]) {
                this._listener[event] = [];
            }
            this._listener[event].push(callback);
        };
        /**
         * Fire event with given arguments.
         *
         * @param {string} event
         * @param {args...} data
         */
        Event.prototype.trigger = function (event) {
            var data = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                data[_i - 1] = arguments[_i];
            }
            var args = Array.apply(null, arguments).slice(1);
            var listeners = this._listener[event];
            if (!listeners) {
                return;
            }
            for (var i = 0; i < listeners.length; i++) {
                listeners[i].apply(null, args);
            }
        };
        return Event;
    }());
    Util.Event = Event;
})(Util || (Util = {}));

/// <reference path="iengageform.ts" />
/// <reference path="isendanswercallback.ts" />
var Engageform;
(function (Engageform_1) {
    var Engageform = (function () {
        function Engageform(data, mode, pages, sendAnswerCallback) {
            var _this = this;
            if (pages === void 0) { pages = []; }
            if (sendAnswerCallback === void 0) { sendAnswerCallback = function () { }; }
            this._pages = {};
            this._startPages = [];
            this._endPages = [];
            this._availablePages = [];
            this._hasForms = false;
            this.enabled = true;
            this.type = Engageform_1.Type.Undefined;
            this.setUserIdent = function (id) {
              Bootstrap.user.sessionId = id;
            };
            this.getUserIdent = function (id) {
              return Bootstrap.user.sessionId;
            };
            // As always, due to the initialisation drama, those values are only available about now.
            Engageform.pagesConsturctors = {
                multiChoice: Page.MultiChoice,
                pictureChoice: Page.PictureChoice,
                rateIt: Page.Rateit,
                forms: Page.Form,
                startPage: Page.StartPage,
                endPage: Page.EndPage,
                buzzer: Page.Buzzer,
                poster: Page.Poster
            };
            this._engageformId = data._id;
            this.mode = mode;
            this.sendAnswerCallback = sendAnswerCallback;
            this.title = data.title;
            this.settings = new Engageform_1.Settings(data);
            this.theme = new Engageform_1.Theme(data);
            this.tabs = new Engageform_1.Tabs(data);
            this.texts = data.texts;
            this.themeType = this.getThemeType(data.theme.backgroundColor);
            this.event = new Util.Event();
            if (data.settings && data.settings.branding) {
                this.branding = new Branding.Branding(data.settings.branding);
            }
            else {
                this.branding = new Branding.Branding({});
            }
            // Handle pages creation.
            var builtPages = this.buildPages(pages, this.settings);
            // Store the pages on the instance.
            builtPages.forEach(function (page) { return _this.storePage(page); });
            // Does the quiz have any form-type pages?
            this._hasForms = builtPages.some(function (page) { return page.type === Page.Type.Form; });
            // Create meta objects.
            this.navigation = new Navigation.Navigation(this);
            this.meta = new Meta.Meta(this);
        }
        Object.defineProperty(Engageform.prototype, "id", {
            get: function () {
                return this._engageformId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engageform.prototype, "pages", {
            get: function () {
                return this._pages;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engageform.prototype, "startPages", {
            get: function () {
                return this._startPages;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engageform.prototype, "endPages", {
            get: function () {
                return this._endPages;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engageform.prototype, "availablePages", {
            get: function () {
                return this._availablePages;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engageform.prototype, "typeName", {
            get: function () {
                return Engageform_1.Type[this.type].toLowerCase();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engageform.prototype, "hasForms", {
            /**
             * @public
             * @description
             * Returns boolean information about the presence of form-type in the current engageform.
             *
             * @returns {boolean} Are there any form-type questions?
             */
            get: function () {
                return this._hasForms;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @public
         * @description
         * Checks if the current engageform is of provided type. Takes Types enum as an argument.
         *
         * @param {Type} type Engageform type from the Type enum.
         * @returns {boolean} Is it?
         */
        Engageform.prototype.isType = function (type) {
            return this.type === type;
        };
        /**
         * Informs if the quiz is currently in a "normal" mode, so all features should work as intended.
         * Normal mode means either default or preview mode.
         *
         * One of the feature that depends on this mode is the availability of start and end pages.
         *
         * @returns {Boolean}
         */
        Engageform.prototype.isNormalMode = function () {
            return Boolean(this.mode === Engageform_1.Mode.Default || this.mode === Engageform_1.Mode.Preview);
        };
        /**
         * Informs if the quiz works in the summary mode.
         * @returns {Boolean} Is summary mode?
         */
        Engageform.prototype.isSummaryMode = function () {
            return Boolean(this.mode === Engageform_1.Mode.Summary);
        };
        /**
         * Informs if the quiz works in the results mode.
         * @returns {Boolean} Is results mode?
         */
        Engageform.prototype.isResultsMode = function () {
            return Boolean(this.mode === Engageform_1.Mode.Result);
        };
        /**
         * Informs if the quiz works in the preview mode.
         * @returns {Boolean} Is preview mode?
         */
        Engageform.prototype.isPreviewMode = function () {
            return Boolean(this.mode === Engageform_1.Mode.Preview);
        };
        /**
         * Stores a single page on the quiz instance.
         *
         * There are two type of stores. One stores only the IDs and start and end pages are stored in different
         * collections. There's also a general collection for all pages where instances are held.
         *
         * Start and end pages are not stored in the summary mode.
         *
         * @param page The page to be stored.
         * @returns {Page.Page} The same page.
         */
        Engageform.prototype.storePage = function (page) {
            if (page.type === Page.Type.StartPage) {
                if (this.isNormalMode()) {
                    this._startPages.push(page.id);
                }
            }
            else if (page.type === Page.Type.EndPage) {
                if (this.isNormalMode()) {
                    this._endPages.push(page.id);
                }
            }
            else {
                this._availablePages.push(page.id);
            }
            this._pages[page.id] = page;
            return page;
        };
        /**
         * Initialises a single page that will take place of the current one.
         *
         * @param page Page data for creating the page's instance.
         * @returns {Page.Page} Built page.
         */
        Engageform.prototype.initPage = function (page) {
            // Build and store the page.
            this.storePage(this.buildPages([page], this.settings)[0]);
            // Set the currently visible page.
            return this.setCurrent(page._id);
        };
        /**
         * Sets the currently visible page by finding it by ID.
         *
         * @param pageId Page's ID to show.
         * @returns {IPage} The visible page.
         */
        Engageform.prototype.setCurrent = function (pageId) {
            var page = this._pages[pageId];
            this.current = page;
            return page;
        };
        Engageform.prototype.setCurrentEndPage = function () {
            var url = Bootstrap.config.backend.domain + Bootstrap.config.engageform.engageformFinishUrl;
            url = url.replace(':engageformId', this._engageformId);
            if (Bootstrap.mode !== Engageform_1.Mode.Default) {
                url += '?preview';
            }
            return Bootstrap.$http.post(url, {
                userIdent: Bootstrap.user.sessionId,
                globalUserIdent: Bootstrap.user.id
            }).then(function (res) {
                if ([200, 304].indexOf(res.status) !== -1) {
                    Bootstrap.localStorage.clearAll();
                    Bootstrap.user.id = res.data.globalUserIdent;
                    return res.data;
                }
                return this.$q.reject(res);
            });
        };
        Engageform.prototype.cleanPages = function () {
            this._availablePages.length = 0;
            this._pages = {};
        };
        /**
       * Builds pages from data delegating the construction to this.createPage method and
       * filters out possibly unsupported pages.
       *
       * @param pages Array with pages data.
       * @param settings this.settings of the current quiz.
       * @returns {Page.Page[]} Array of pages.
         */
        Engageform.prototype.buildPages = function (pages, settings) {
            var _this = this;
            return pages
                .map(function (page) { return _this.createPage(page, settings); })
                .filter(function (val) { return Boolean(val); });
        };
        /**
       * Creates a single page. If the type is not supported (ie. doesn't have a constructor) will return undefined.
       *
       * @param page Pages data.
       * @param settings this.settings.
       * @returns {Page.Page|void} Page instance or undefined if unsupported type.
       */
        Engageform.prototype.createPage = function (page, settings) {
            if (Engageform.pagesConsturctors[page.type]) {
                return new Engageform.pagesConsturctors[page.type](this, page, settings);
            }
        };
        /**
         * Takes the results data and applies them on the pages.
         * @param results
         */
        Engageform.prototype.setSummary = function (results) {
            var _this = this;
            results.forEach(function (questionResults) {
                if (_this._pages[questionResults.stats.questionId]) {
                    _this._pages[questionResults.stats.questionId].setResults(questionResults);
                }
            });
        };
        /**
         * In results mode, sets the user picked answers on the pages.
         * @param questions
         */
        Engageform.prototype.setAnswers = function (_a) {
            var questions = _a.questions;
            for (var questionId in questions) {
                if (this._pages[questionId]) {
                    var props = questions[questionId];
                    this._pages[questionId].selectAnswer({
                        selectedCaseId: props.selectedAnswerId,
                        inputs: props.inputs,
                        selectedValue: props.rateItValue
                    });
                }
            }
        };
        Engageform.prototype.setResultPage = function (stats) {
            var data = {
                _id: 'summaryPage',
                type: 'summaryPage',
                settings: {
                    showCorrectAnswer: true
                },
                stats: stats
            };
            var resultPage = new Page.SummaryPage(this, data);
            this.storePage(resultPage);
        };
        /**
       * Creates a page showing user's outcome or score in adequate quiz types. Used only in the results-preview mode.
       * @param data
       */
        Engageform.prototype.setUserResultPage = function (data) {
            var pageData = {
                _id: 'RESULT_PAGE',
                type: 'summaryPage',
                settings: {}
            };
            if (data.type === 'outcome') {
                _.extend(pageData, {
                    text: 'User\'s outcome: ' + data.outcome
                });
            }
            else {
                _.extend(pageData, {
                    text: 'User\'s score: ' + data.score + ' / ' + data.maxScore
                });
            }
            var resultPage = new Page.SummaryPage(this, pageData);
            this.storePage(resultPage);
        };
        Engageform.prototype.getThemeType = function (color) {
            var colorRGB = this.colorToRgb(color);
            if ((colorRGB.red * 0.299 + colorRGB.green * 0.587 + colorRGB.blue * 0.114) > 186) {
                return 'light';
            }
            else {
                return 'dark';
            }
        };
        Engageform.prototype.colorToRgb = function (color) {
            var colorParts, temp, triplets;
            if (color[0] === '#') {
                color = color.substr(1);
            }
            else {
                colorParts = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
                color = (colorParts && colorParts.length === 4) ? ('0' + parseInt(colorParts[1], 10).toString(16)).slice(-2) +
                    ('0' + parseInt(colorParts[2], 10).toString(16)).slice(-2) +
                    ('0' + parseInt(colorParts[3], 10).toString(16)).slice(-2) : '';
            }
            if (color.length === 3) {
                temp = color;
                color = '';
                temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
                for (var i = 0; i < 3; i++) {
                    color += temp[i] + temp[i];
                }
            }
            triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(color).slice(1);
            return {
                red: parseInt(triplets[0], 16),
                green: parseInt(triplets[1], 16),
                blue: parseInt(triplets[2], 16)
            };
        };
        return Engageform;
    }());
    Engageform_1.Engageform = Engageform;
})(Engageform || (Engageform = {}));

/// <reference path="api/api.ts" />
/// <reference path="navigation/navigation.ts" />
/// <reference path="meta/meta.ts" />
/// <reference path="page/page.ts" />
/// <reference path="user/user.ts" />
/// <reference path="util/event.ts" />
/// <reference path="engageform/engageform.ts" />
var Bootstrap = (function () {
    function Bootstrap($http, $q, $timeout, cloudinary, localStorage, ApiConfig) {
        Bootstrap.$http = $http;
        Bootstrap.$q = $q;
        Bootstrap.$timeout = $timeout;
        Bootstrap.cloudinary = cloudinary;
        Bootstrap.localStorage = localStorage;
        Bootstrap.config = ApiConfig;
        Bootstrap.user = new User();
        // Map names to constructors.
        Bootstrap.quizzesConstructors = {
            outcome: Engageform.Outcome,
            poll: Engageform.Poll,
            score: Engageform.Score,
            survey: Engageform.Survey,
            live: Engageform.Live
        };
        Bootstrap.modes = {
            preview: Engageform.Mode.Preview,
            summary: Engageform.Mode.Summary,
            results: Engageform.Mode.Result,
            'default': Engageform.Mode.Default,
            '': Engageform.Mode.Default
        };
        // FIXME: This is inaccessible inside the library, since it's the consumer app that creates the instance so it
        // isn't possible to actually trigger any event! I'm leaving it here because I don't care enough to check
        // if any app tries to subscribe for this event. I'm almost sure it's safe to remove, though.
        this._event = new Util.Event();
        Bootstrap.cloudinary.setConfig(ApiConfig.cloudinary);
    }
    Object.defineProperty(Bootstrap.prototype, "type", {
        get: function () {
            if (this._engageform) {
                return this._engageform.type;
            }
            return Engageform.Type.Undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bootstrap.prototype, "Type", {
        get: function () {
            return Engageform.Type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bootstrap.prototype, "mode", {
        get: function () {
            return Bootstrap.mode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bootstrap.prototype, "Mode", {
        get: function () {
            return Engageform.Mode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bootstrap.prototype, "title", {
        get: function () {
            if (this._engageform) {
                return this._engageform.title;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bootstrap.prototype, "theme", {
        get: function () {
            if (this._engageform) {
                return this._engageform.theme;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bootstrap.prototype, "current", {
        get: function () {
            if (this._engageform) {
                return this._engageform.current;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bootstrap.prototype, "navigation", {
        get: function () {
            if (this._engageform) {
                return this._engageform.navigation;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bootstrap.prototype, "branding", {
        get: function () {
            if (this._engageform) {
                return this._engageform.branding;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bootstrap.prototype, "message", {
        get: function () {
            if (this._engageform) {
                return this._engageform.message;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bootstrap.prototype, "meta", {
        get: function () {
            if (this._engageform) {
                return this._engageform.meta;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bootstrap.prototype, "event", {
        get: function () {
            if (this._event) {
                return this._event;
            }
        },
        enumerable: true,
        configurable: true
    });
    Bootstrap.prototype.init = function (opts) {
        var _this = this;
        // Options are required and need to have a quiz ID.
        if (!opts || !opts.id) {
            return Bootstrap.$q.reject({
                status: 'error',
                error: {
                    code: 406,
                    message: 'The required id property does not exist.'
                },
                data: opts
            });
        }
        // Return already initialised instance if already exists.
        if (Bootstrap._instances[opts.id]) {
            return Bootstrap._instances[opts.id];
        }
        // When mode is not provided, set id to default.
        if (typeof opts.mode === 'undefined') {
            opts.mode = 'default';
        }
        // If the requested mode is not supported, reject the initialisation.
        if (!Bootstrap.modes[opts.mode]) {
            return Bootstrap.$q.reject({
                status: 'error',
                error: {
                    code: 406,
                    message: 'Mode property not supported.'
                },
                data: opts
            });
        }
        // Set the mode in which the whole library operates.
        Bootstrap.mode = Bootstrap.modes[opts.mode];
        // Create the promises map that will have to resolve before the quiz is initialised.
        var initializationPromises = {
            quizData: Bootstrap.getData('quiz', opts.id)
        };
        // If the quiz is not live get the pages before initialising it.
        if (!opts.live) {
            initializationPromises.pages = Bootstrap.getData('pages', opts.id);
        }
        // Initialize the quiz.
        return Bootstrap.$q.all(initializationPromises).then(function (data) {
            // If the quiz doesn't have a supported constructor, reject the promise with error.
            if (!Bootstrap.quizzesConstructors[data.quizData.type]) {
                return Bootstrap.$q.reject({
                    status: 'error',
                    error: {
                        code: 406,
                        message: 'Type property not supported.'
                    },
                    data: data.quizData
                });
            }
            // Create the Engageform's instance.
            _this._engageform = new Bootstrap.quizzesConstructors[data.quizData.type](data.quizData, Bootstrap.mode, data.pages, opts.callback ? opts.callback.sendAnswerCallback : function () { });
            return _this._engageform;
        });
    };
    /**
   * Fetches the two types of data from the API: quiz data and pages data.
   * @param type Resource type: quiz or pages.
   * @param id ID of the quiz.
   * @returns {IPromise<API.IQuizQuestion[]|API.IQuiz>}
   */
    Bootstrap.getData = function (type, id) {
        var resourcesPaths = {
            quiz: 'engageformUrl',
            pages: 'engageformPagesUrl'
        };
        // Basic validation.
        if (!resourcesPaths[type]) {
            throw new Error("Resource path for " + type + " type of data is unknown.");
        }
        // Decide the data URL depending on the type.
        var url = Bootstrap.config.backend.domain +
            Bootstrap.config.engageform[type === 'quiz' ? 'engageformUrl' : 'engageformPagesUrl'];
        // Valid ID required.
        url = url.replace(':engageformId', id);
        // Inform the backend it shouldn't store statistics when a quiz is not in a default mode.
        if (Bootstrap.mode !== Engageform.Mode.Default) {
            url += '?preview';
        }
        // Go, fetch the data.
        return Bootstrap.$http.get(url).then(function (res) {
            if ([200, 304].indexOf(res.status) !== -1) {
                return res.data;
            }
            Bootstrap.$q.reject(res);
        });
    };
    Bootstrap.prototype.destroyInstances = function () {
        Bootstrap._instances = {};
    };
    Bootstrap.mode = Engageform.Mode.Undefined;
    Bootstrap._instances = {};
    return Bootstrap;
}());
Bootstrap.$inject = ['$http', '$q', '$timeout', 'cloudinary', 'localStorageService', 'ApiConfig'];
app.service('Engageform', Bootstrap);

/// <reference path="ibranding.ts" />
var Branding;
(function (Branding_1) {
    var Branding = (function () {
        function Branding(data) {
            if (data === void 0) { data = {}; }
            this._isCustomLogo = false;
            // Marks the branding if it is a custom, ie. user defined at least one own value.
            this._isCustom = false;
            var imgUrl;
            var defaultBranding = Bootstrap.config.backend.branding;
            // Is branding enabled? (State of the enabled branding is false, so negating that).
            this._enabled = !data.state;
            // If there's any branding data, it means that this is a custom branding.
            if (data.text || data.link || data.imageUrl) {
                this._isCustom = true;
            }
            // Set the branding properties form the data object or from the default values.
            this._text = typeof data.text === 'undefined' ? defaultBranding.text : data.text;
            this._link = typeof data.link === 'undefined' ? defaultBranding.link : data.link;
            // Image URL is a bit complicated.
            if (typeof data.imageUrl === 'undefined') {
                imgUrl = defaultBranding.imageUrl;
            }
            else {
                imgUrl = data.imageUrl;
                this._isCustomLogo = true;
            }
            // The image's URL is a bit different if it is a default one, than when it is a custom.
            if (imgUrl === defaultBranding.imageUrl) {
                this._imageUrl = Bootstrap.config.backend.api + imgUrl;
            }
            else {
                this._imageUrl = imgUrl ? Bootstrap.config.backend.api + Bootstrap.config.backend.imagesUrl + '/' + imgUrl : '';
            }
        }
        Object.defineProperty(Branding.prototype, "isCustom", {
            get: function () {
                return this._isCustom;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Branding.prototype, "isCustomLogo", {
            get: function () {
                return this._isCustomLogo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Branding.prototype, "isDefault", {
            get: function () {
                return !this._isCustom;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Branding.prototype, "imageUrl", {
            get: function () {
                return this._imageUrl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Branding.prototype, "link", {
            get: function () {
                return this._link;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Branding.prototype, "text", {
            get: function () {
                return this._text;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Branding.prototype, "enabled", {
            get: function () {
                return this._enabled;
            },
            enumerable: true,
            configurable: true
        });
        return Branding;
    }());
    Branding_1.Branding = Branding;
})(Branding || (Branding = {}));

/// <reference path="isettings.ts" />
var Engageform;
(function (Engageform) {
    var Settings = (function () {
        function Settings(data) {
            this.allowAnswerChange = false;
            this.hideMessageAfterDelay = 3000;
            if (data.settings) {
                this.allowAnswerChange = !!data.settings.allowAnswerChange;
                if (data.settings.hideMessageAfterDelay) {
                    this.hideMessageAfterDelay = data.settings.hideMessageAfterDelay;
                }
                if (data.settings.share) {
                    this.share = data.settings.share;
                    if (!this.share.imageUrl && Bootstrap.config.share && Bootstrap.config.share.defaultImgUrl) {
                        this.share.imageUrl = Bootstrap.config.share.defaultImgUrl;
                    }
                }
            }
        }
        return Settings;
    }());
    Engageform.Settings = Settings;
})(Engageform || (Engageform = {}));

/// <reference path="itheme.ts" />
var Engageform;
(function (Engageform) {
    var Theme = (function () {
        function Theme(data) {
            this.answerBackgroundColor = '';
            this.answerBorderColor = '';
            this.answerColor = '';
            this.backgroundBrightness = '';
            this.backgroundColor = '';
            this.backgroundImageBlur = '';
            this.backgroundImageFile = '';
            this.backgroundImagePosition = '';
            this.buttonColor = '';
            this.font = '';
            this.questionColor = '';
            this.customThemeCssFile = '';
            this.backgroundImageConvertedFile = '';
            this.tabBorderColor = '';
            this.tabFontColor = '';
            this.tabColor = '';
            if (data.theme) {
                this.answerBackgroundColor = data.theme.answerBackgroundColor || '';
                this.answerBorderColor = data.theme.answerBorderColor || '';
                this.answerColor = data.theme.answerColor || '';
                this.backgroundBrightness = data.theme.backgroundBrightness || '';
                this.backgroundColor = data.theme.backgroundColor || '';
                this.backgroundImageBlur = data.theme.backgroundImageBlur || '';
                this.backgroundImageFile = data.theme.backgroundImageFile || '';
                this.backgroundImagePosition = data.theme.backgroundImagePosition || '';
                this.buttonColor = data.theme.buttonColor || '';
                this.font = data.theme.font || '';
                this.questionColor = data.theme.questionColor || '';
                this.tabColor = data.theme.tabColor || '';
                this.tabFontColor = data.theme.tabFontColor || '';
                this.tabBorderColor = data.theme.tabBorderColor || '';
                if (data.theme.customThemeCssFile) {
                    this.customThemeCssFile = Bootstrap.config.backend.api + '/uploads/' + data.theme.customThemeCssFile;
                }
                if (data.theme.backgroundImageFile) {
                    this.convertBackgroundImage();
                }
            }
        }
        Theme.prototype.convertBackgroundImage = function () {
            this.backgroundImageConvertedFile = Bootstrap.cloudinary.prepareBackgroundImageUrl(this.backgroundImageFile, window.innerWidth, window.innerHeight, parseInt(this.backgroundImageBlur, 10), this.backgroundImagePosition);
        };
        return Theme;
    }());
    Engageform.Theme = Theme;
})(Engageform || (Engageform = {}));

/// <reference path="itabs.ts" />
var Engageform;
(function (Engageform) {
    var Tabs = (function () {
        function Tabs(data) {
            this.liveTitle = 'Live';
            this.chatTitle = 'Chat';
            this.logoUrl = '';
            this.headerText = '';
            if (data.tabs) {
                if (data.tabs.liveTitle) {
                    this.liveTitle = data.tabs.liveTitle;
                }
                if (data.tabs.chatTitle) {
                    this.chatTitle = data.tabs.chatTitle;
                }
                if (data.tabs.logoUrl) {
                    // The image's URL is a bit different if it is a default one, than when it is a custom.
                    this.logoUrl = Bootstrap.config.backend.api + Bootstrap.config.backend.imagesUrl + '/' + data.tabs.logoUrl;
                }
                if (data.tabs.headerText) {
                    this.headerText = data.tabs.headerText;
                }
            }
        }
        return Tabs;
    }());
    Engageform.Tabs = Tabs;
})(Engageform || (Engageform = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Engageform;
(function (Engageform) {
    var Outcome = (function (_super) {
        __extends(Outcome, _super);
        function Outcome() {
            _super.apply(this, arguments);
            this.type = Engageform.Type.Outcome;
        }
        Outcome.prototype.setCurrentEndPage = function () {
            var _this = this;
            return _super.prototype.setCurrentEndPage.call(this).then(function (data) {
                var hasEndPage = false;
                _this.endPages.map(function (pageId) {
                    var page = _this.pages[pageId];
                    if (page.outcome === data.outcome) {
                        hasEndPage = true;
                        _this.setCurrent(pageId);
                    }
                });
                if (!hasEndPage) {
                    _this.enabled = false;
                    _this.message = 'Thank you!';
                }
                return data;
            });
        };
        return Outcome;
    }(Engageform.Engageform));
    Engageform.Outcome = Outcome;
})(Engageform || (Engageform = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Engageform;
(function (Engageform) {
    var Poll = (function (_super) {
        __extends(Poll, _super);
        function Poll() {
            _super.apply(this, arguments);
            this.type = Engageform.Type.Poll;
        }
        Poll.prototype.setCurrentEndPage = function () {
            var _this = this;
            return _super.prototype.setCurrentEndPage.call(this).then(function (data) {
                if (_this.endPages.length) {
                    _this.setCurrent(_this.endPages[0]);
                }
                else {
                    _this.enabled = false;
                    _this.message = 'Thank you!';
                }
                return data;
            });
        };
        return Poll;
    }(Engageform.Engageform));
    Engageform.Poll = Poll;
})(Engageform || (Engageform = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Engageform;
(function (Engageform) {
    var Score = (function (_super) {
        __extends(Score, _super);
        function Score() {
            _super.apply(this, arguments);
            this.type = Engageform.Type.Score;
        }
        Score.prototype.setCurrentEndPage = function () {
            var _this = this;
            return _super.prototype.setCurrentEndPage.call(this).then(function (data) {
                var score = 100;
                var hasEndPage = false;
                // Error divide by zero...
                if (data.maxScore > 0) {
                    score = Math.round(data.totalScore / data.maxScore * 100);
                }
                _this.endPages.map(function (pageId) {
                    var page = _this.pages[pageId];
                    if (page.rangeMin <= score && page.rangeMax >= score) {
                        hasEndPage = true;
                        _this.pages[pageId].score = score;
                        _this.setCurrent(pageId);
                    }
                });
                if (!hasEndPage) {
                    _this.enabled = false;
                    _this.message = 'Thank you!';
                }
                return data;
            });
        };
        return Score;
    }(Engageform.Engageform));
    Engageform.Score = Score;
})(Engageform || (Engageform = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Engageform;
(function (Engageform) {
    var Survey = (function (_super) {
        __extends(Survey, _super);
        function Survey() {
            _super.apply(this, arguments);
            this.type = Engageform.Type.Survey;
        }
        Survey.prototype.setCurrentEndPage = function () {
            var _this = this;
            return _super.prototype.setCurrentEndPage.call(this).then(function (data) {
                if (_this.endPages.length) {
                    _this.setCurrent(_this.endPages[0]);
                }
                else {
                    _this.enabled = false;
                    _this.message = 'Thank you!';
                }
                return data;
            });
        };
        return Survey;
    }(Engageform.Engageform));
    Engageform.Survey = Survey;
})(Engageform || (Engageform = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Engageform;
(function (Engageform) {
    var Live = (function (_super) {
        __extends(Live, _super);
        function Live() {
            _super.apply(this, arguments);
            this.type = Engageform.Type.Live;
        }
        Live.prototype.initPages = function () {
            var deferred = Bootstrap.$q.defer();
            deferred.resolve(this);
            return deferred.promise;
        };
        ;
        Live.prototype.initPage = function (page) {
            // Clean other pages.
            this.cleanPages();
            // Initialize the single page.
            return _super.prototype.initPage.call(this, page);
        };
        Live.prototype.setCurrentEndPage = function () {
            var deferred = Bootstrap.$q.defer();
            deferred.resolve();
            return deferred.promise;
        };
        return Live;
    }(Engageform.Engageform));
    Engageform.Live = Live;
})(Engageform || (Engageform = {}));

/// <reference path="icase.ts" />
var Page;
(function (Page) {
    var Case = (function () {
        function Case(page, data) {
            this.type = Page.CaseType.Undefined;
            this.selected = false;
            this.correct = false;
            this.incorrect = false;
            this.result = 0;
            this._caseId = data._id;
            this._page = page;
        }
        Object.defineProperty(Case.prototype, "id", {
            get: function () {
                return this._caseId;
            },
            set: function (caseId) {
                this._caseId = caseId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Case.prototype, "page", {
            get: function () {
                return this._page;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Method used to inform if the correct or incorrect indicator should be shown. Combine with ngIf or ngShow.
         * Indicator is shown when the page's settings allow so and (1) the answer is selected or (2) the questions is
         * answered and the case is correct. Not shown in the summary and results modes.
         * @returns {boolean} Should the indicator be shown?
         */
        Case.prototype.shouldShowIndicator = function () {
            return !this._page.engageform.isSummaryMode() && !this._page.engageform.isResultsMode()
                && this._page.settings.showCorrectAnswer && (this.selected || (this._page.filled && this.correct));
        };
        /**
         * Informs if the results should be shown (in the summary mode or when the page is filled and set to do so).
         * @returns {boolean} Should result be shown.
         */
        Case.prototype.shouldShowResults = function () {
            return this._page.engageform.isSummaryMode() ||
                this._page.settings.showResults && this._page.filled && !this._page.engageform.isResultsMode();
        };
        /**
         * Method created mostly to mislead programmer making him think this is how the answer is sent. Too bad!
         * You've been goofed! The real sending is done in subclasses.
         * @returns {IPromise<T>}
         */
        Case.prototype.send = function () {
            var deferred = Bootstrap.$q.defer();
            deferred.resolve({});
            return deferred.promise;
        };
        Case.prototype.makeSend = function (data) {
            var url = Bootstrap.config.backend.domain + Bootstrap.config.engageform.pageResponseUrl;
            url = url.replace(':pageId', this.page.id);
            if (Bootstrap.mode !== Engageform.Mode.Default) {
                url += '?preview';
            }
            data.quizQuestionId = this.page.id;
            data.userIdent = Bootstrap.user.sessionId;
            return Bootstrap.$http.post(url, data).then(function (res) {
                if ([200, 304].indexOf(res.status) !== -1) {
                    if (!data.userIdent) {
                        Bootstrap.user.sessionId = res.data.userIdent;
                    }
                    return res.data;
                }
                else {
                    return Bootstrap.$q.reject(res.data || {});
                }
            }).catch(function (res) {
                return Bootstrap.$q.reject(res.data || {});
            });
        };
        Case.prototype.load = function () {
            return Bootstrap.localStorage.get('page.' + this.page.id) || {};
        };
        Case.prototype.save = function (data) {
            Bootstrap.localStorage.set('page.' + this.page.id, data);
        };
        Case.prototype.validate = function () {
            // "abstract"
            return true;
        };
        // Buzzer need extra send, so we made this abstract
        Case.prototype.trueBuzzerSend = function (BCS) {
            // "abstract"
        };
        return Case;
    }());
    Page.Case = Case;
})(Page || (Page = {}));

/// <reference path="isettings.ts" />
var Page;
(function (Page) {
    var Settings = (function () {
        function Settings(data) {
            this.showResults = false;
            this.showCorrectAnswer = false;
            this.showMainMedia = false;
            this.showDescription = false;
            this.requiredAnswer = false;
            this.requiredAnswer = !!data.requiredAnswer;
            if (data.settings) {
                this.showResults = !!data.settings.showAnswers;
                this.showCorrectAnswer = !!data.settings.showCorrectAnswer;
                this.showMainMedia = !!data.settings.showMainMedia;
                this.showDescription = !!data.settings.showDescription;
            }
        }
        return Settings;
    }());
    Page.Settings = Settings;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Page;
(function (Page) {
    var ImageCase = (function (_super) {
        __extends(ImageCase, _super);
        function ImageCase(page, data) {
            _super.call(this, page, data);
            this.type = Page.CaseType.Image;
            this.title = data.text;
            this.media = Bootstrap.cloudinary.prepareImageUrl(data.imageFile, 300, data.imageData);
            this.mediaWidth = 300;
            if (data.imageData && data.imageData.containerRatio) {
                this.mediaHeight = Math.round(300 * data.imageData.containerRatio);
            }
            else {
                this.mediaHeight = Math.round(data.imageData.containerHeight || 0);
            }
        }
        ImageCase.prototype.send = function () {
            var _this = this;
            if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
                return Bootstrap.$q.reject({ textKey: 'CHANGING_NOT_ALLOWED', message: 'Changing answer is not allowed' });
            }
            return _super.prototype.makeSend.call(this, { selectedAnswerId: this.id }).then(function (res) {
                var data = {};
                if (res.selectedAnswerId) {
                    data.selectedCaseId = res.selectedAnswerId;
                }
                if (res.correctAnswerId) {
                    data.correctCaseId = res.correctAnswerId;
                }
                for (var caseId in res.stats) {
                    if (res.stats.hasOwnProperty(caseId)) {
                        data.results = data.results || {};
                        if (/.{24}/.test(caseId)) {
                            data.results[caseId] = res.stats[caseId];
                        }
                    }
                }
                _super.prototype.save.call(_this, data);
                _this.page.selectAnswer(data);
                return data;
            });
        };
        return ImageCase;
    }(Page.Case));
    Page.ImageCase = ImageCase;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Page;
(function (Page) {
    var InputCase = (function (_super) {
        __extends(InputCase, _super);
        function InputCase(page, data) {
            _super.call(this, page, data);
            this.type = Page.CaseType.Input;
            this.title = data.label;
            this.expectedValue = data.type;
            this.value = '';
        }
        InputCase.prototype.send = function () {
            var _this = this;
            var data = {};
            data.inputs = [];
            var sent = this.load();
            for (var sentId in sent) {
                if (sent.hasOwnProperty(sentId)) {
                    data.inputs.push({
                        _id: sentId,
                        value: sent[sentId]
                    });
                }
            }
            return _super.prototype.makeSend.call(this, data).then(function () {
                return data;
            }).catch(function (data) {
                if (data.code === 406) {
                    data.textKey = 'INCORRECT_INPUT';
                    data.message = 'Incorrect inputs sent. Try again.';
                    _this.save({});
                }
                return Bootstrap.$q.reject(data);
            });
        };
        InputCase.prototype.validate = function () {
            this.correct = false;
            this.incorrect = false;
            if (this.page.settings.requiredAnswer && !this.value) {
                this.error = 'Answer is required';
                this.incorrect = true;
            }
            else {
                this.error = '';
                this.correct = true;
            }
            if (this.correct) {
                var sent = this.load();
                sent[this.id] = this.value;
                this.save(sent);
                return true;
            }
            return false;
        };
        return InputCase;
    }(Page.Case));
    Page.InputCase = InputCase;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Page;
(function (Page) {
    var IterationCase = (function (_super) {
        __extends(IterationCase, _super);
        function IterationCase(page, data) {
            _super.call(this, page, data);
            this.type = Page.CaseType.Iteration;
            this.selected = false;
            this.ordinal = data.ordinal;
            this.symbol = data.symbol;
        }
        IterationCase.prototype.send = function () {
            var _this = this;
            if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
                return Bootstrap.$q.reject({ textKey: 'CHANGING_NOT_ALLOWED', message: 'Changing answer is not allowed' });
            }
            return _super.prototype.makeSend.call(this, { quizQuestionId: this.page.id, rateItValue: this.ordinal }).then(function (res) {
                var data = {};
                if (res.selectedValue) {
                    data.selectedValue = res.selectedValue;
                }
                if (res.avgRateItValue) {
                    data.result = +res.avgRateItValue;
                }
                _super.prototype.save.call(_this, data);
                _this.page.selectAnswer(data);
                return data;
            });
        };
        return IterationCase;
    }(Page.Case));
    Page.IterationCase = IterationCase;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Page;
(function (Page) {
    var TextCase = (function (_super) {
        __extends(TextCase, _super);
        function TextCase(page, data) {
            _super.call(this, page, data);
            this.type = Page.CaseType.Text;
            this.title = data.text;
        }
        TextCase.prototype.send = function () {
            var _this = this;
            if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
                return Bootstrap.$q.reject({ textKey: 'CHANGING_NOT_ALLOWED', message: 'Changing answer is not allowed' });
            }
            return _super.prototype.makeSend.call(this, { selectedAnswerId: this.id }).then(function (res) {
                var data = {};
                if (res.selectedAnswerId) {
                    data.selectedCaseId = res.selectedAnswerId;
                }
                if (res.correctAnswerId) {
                    data.correctCaseId = res.correctAnswerId;
                }
                for (var caseId in res.stats) {
                    if (res.stats.hasOwnProperty(caseId)) {
                        data.results = data.results || {};
                        if (/.{24}/.test(caseId)) {
                            data.results[caseId] = res.stats[caseId];
                        }
                    }
                }
                _super.prototype.save.call(_this, data);
                _this.page.selectAnswer(data);
                return data;
            });
        };
        return TextCase;
    }(Page.Case));
    Page.TextCase = TextCase;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Page;
(function (Page) {
    var BuzzCase = (function (_super) {
        __extends(BuzzCase, _super);
        function BuzzCase(page, data) {
            _super.call(this, page, data);
            this.type = Page.CaseType.Buzz;
            this.page = page;
        }
        BuzzCase.prototype.send = function () {
            // We dont really send buzzes here, just increase buttonClickSum here
            this.page.clickBuzzer();
            var deferred = Bootstrap.$q.defer();
            deferred.resolve({});
            return deferred.promise;
        };
        BuzzCase.prototype.trueBuzzerSend = function (BCS) {
            return _super.prototype.makeSend.call(this, { quizQuestionId: this.page.id, buttonClickSum: BCS }).then(function (res) {
                var data = {};
                // IMO we don't need that since buzzer have fake answerId's
                // super.save(data);
                // this.page.selectAnswer(data);
                return data;
            });
        };
        return BuzzCase;
    }(Page.Case));
    Page.BuzzCase = BuzzCase;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Page;
(function (Page) {
    var EndPage = (function (_super) {
        __extends(EndPage, _super);
        function EndPage(engageform, data, settings) {
            _super.call(this, engageform, data);
            this.type = Page.Type.EndPage;
            this.isCoverPage = true;
            this.socialData = {
                title: settings.share.title,
                description: settings.share.description,
                imageUrl: settings.share.imageUrl,
                link: settings.share.link
            };
            if (data.coverPage) {
                this.button = data.coverPage.buttonText;
                this.outcome = data.coverPage.outcome;
                this.social = data.coverPage.showSocialShares;
                this.exitLink = data.coverPage.exitLink;
                this.link = data.coverPage.link;
                if (data.coverPage.scoreRange) {
                    this.rangeMax = data.coverPage.scoreRange.max;
                    this.rangeMin = data.coverPage.scoreRange.min;
                }
            }
        }
        EndPage.prototype.personalizeShares = function () {
            // console.log('[ Endpage ] Personalize shares');
            if (this.engageform.typeName === 'outcome' || this.engageform.typeName === 'score') {
                // Replace $TITLE$ and $RESULT$ tags in the translation and set the title.
                this.socialData.title = this.engageform.texts.SCORE_AND_OUTCOME_SHARE
                    .replace(/\$RESULT\$/gi, this.outcome || String(this.score || 0))
                    .replace(/\$TITLE\$/gi, this.engageform.title);
                if (this.media && this.settings.showMainMedia) {
                    this.socialData.imageUrl = this.media;
                }
            }
        };
        Object.defineProperty(EndPage.prototype, "fbLink", {
            get: function () {
                if (Bootstrap.config.backend && Bootstrap.config.backend.domain &&
                    Bootstrap.config.share && Bootstrap.config.share.facebook &&
                    this.socialData && this.socialData.title && this.socialData.description &&
                    this.socialData.imageUrl && this.engageform && this.engageform.id) {
                    this.personalizeShares();
                    return Bootstrap.config.backend.domain + Bootstrap.config.share.facebook + '?quizId=' + this.engageform.id +
                        '&description=' + encodeURIComponent(this.socialData.description) + '&name=' +
                        encodeURIComponent(this.socialData.title) + '&image=' + this.socialData.imageUrl;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EndPage.prototype, "twLink", {
            get: function () {
                if (this.socialData && this.socialData.title && this.socialData.link) {
                    this.personalizeShares();
                    return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(this.socialData.title)
                        + ' ' + this.socialData.link + ' via @4screens';
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        return EndPage;
    }(Page.Page));
    Page.EndPage = EndPage;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Page;
(function (Page) {
    var Form = (function (_super) {
        __extends(Form, _super);
        function Form(engageform, data) {
            var _this = this;
            _super.call(this, engageform, data);
            this.type = Page.Type.Form;
            this.count = 0;
            if (!data.forms) {
                return;
            }
            this.cases = data.forms.inputs.map(function (input) {
                return _this.createCase(input);
            });
            if (this.cases.length) {
                this.sent().then(function (sent) {
                    _this.selectAnswer(sent);
                });
            }
        }
        Form.prototype.createCase = function (input) {
            return new Page.InputCase(this, input);
        };
        Form.prototype.send = function (vcase) {
            var deferred = Bootstrap.$q.defer();
            var validated = true;
            this.cases.map(function (input) {
                if (!input.validate()) {
                    validated = false;
                }
            });
            if (validated) {
                this.filled = true;
                this.engageform.sendAnswerCallback(this.engageform.title || this.engageform.id, this.engageform.current ? this.engageform.current.title || this.engageform.current.id : null, this.cases[0]);
                deferred.resolve(this.cases[0].send());
            }
            else {
                this.filled = false;
                deferred.resolve({});
            }
            return deferred.promise;
        };
        Form.prototype.selectAnswer = function (sent) {
            this.cases.map(function (vcase) {
                vcase.value = sent[vcase.id] || '';
                // In results mode, there might be data containing user inputs, so set it as the case value.
                if (sent.inputs) {
                    sent.inputs.forEach(function (inputData) {
                        if (inputData._id === vcase.id) {
                            vcase.value = inputData.value;
                        }
                    });
                }
            });
        };
        Form.prototype.setResults = function (results) {
            this.count = results.count;
        };
        return Form;
    }(Page.Page));
    Page.Form = Form;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Page;
(function (Page) {
    var MultiChoice = (function (_super) {
        __extends(MultiChoice, _super);
        function MultiChoice(engageform, data) {
            var _this = this;
            _super.call(this, engageform, data);
            this.type = Page.Type.MultiChoice;
            if (!data.answers) {
                return;
            }
            this.cases = data.answers.map(function (answer) {
                return _this.createCase(answer);
            });
            if (this.cases.length) {
                this.sent().then(function (sent) {
                    _this.selectAnswer(sent);
                });
            }
        }
        MultiChoice.prototype.createCase = function (answer) {
            return new Page.TextCase(this, answer);
        };
        MultiChoice.prototype.refreshAnswer = function (sent, question) {
            question.answers.map(function (answer) {
                sent.results[answer._id] = answer.percent;
            });
            return sent;
        };
        MultiChoice.prototype.selectAnswer = function (sent) {
            var _this = this;
            this.cases.map(function (vcase) {
                vcase.selected = false;
                vcase.correct = false;
                vcase.incorrect = false;
                if (vcase.id === sent.selectedCaseId) {
                    _this.engageform.sendAnswerCallback(_this.engageform.title || _this.engageform.id, _this.engageform.current ? _this.engageform.current.title || _this.engageform.current.id : null, vcase);
                    _this.filled = true;
                    vcase.selected = true;
                }
                if (sent.results) {
                    vcase.result = sent.results[vcase.id] || 0;
                }
                // Mark case as correct or incorrect.
                if (vcase.id === sent.correctCaseId) {
                    vcase.correct = true;
                }
                else {
                    vcase.incorrect = true;
                }
            });
        };
        return MultiChoice;
    }(Page.Page));
    Page.MultiChoice = MultiChoice;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Page;
(function (Page) {
    var PictureChoice = (function (_super) {
        __extends(PictureChoice, _super);
        function PictureChoice(engageform, data) {
            var _this = this;
            _super.call(this, engageform, data);
            this.type = Page.Type.PictureChoice;
            if (!data.answers) {
                return;
            }
            this.cases = data.answers.map(function (answer) {
                return _this.createCase(answer);
            });
            if (this.cases.length) {
                this.sent().then(function (sent) {
                    _this.selectAnswer(sent);
                });
            }
        }
        PictureChoice.prototype.createCase = function (answer) {
            return new Page.ImageCase(this, answer);
        };
        PictureChoice.prototype.refreshAnswer = function (sent, question) {
            question.answers.map(function (answer) {
                sent.results[answer._id] = answer.percent;
            });
            return sent;
        };
        PictureChoice.prototype.selectAnswer = function (sent) {
            var _this = this;
            this.cases.map(function (vcase) {
                vcase.selected = false;
                vcase.correct = false;
                vcase.incorrect = false;
                if (vcase.id === sent.selectedCaseId) {
                    _this.engageform.sendAnswerCallback(_this.engageform.title || _this.engageform.id, _this.engageform.current ? _this.engageform.current.title || _this.engageform.current.id : null, vcase);
                    _this.filled = true;
                    vcase.selected = true;
                }
                if (sent.results) {
                    vcase.result = sent.results[vcase.id] || 0;
                }
                // Mark case as correct or incorrect.
                if (vcase.id === sent.correctCaseId) {
                    vcase.correct = true;
                }
                else {
                    vcase.incorrect = true;
                }
            });
        };
        return PictureChoice;
    }(Page.Page));
    Page.PictureChoice = PictureChoice;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Page;
(function (Page) {
    var Rateit = (function (_super) {
        __extends(Rateit, _super);
        function Rateit(engageform, data) {
            var _this = this;
            _super.call(this, engageform, data);
            this.type = Page.Type.Rateit;
            this.selectedValue = 0;
            this.labelMin = data.rateIt.minLabel;
            this.labelMax = data.rateIt.maxLabel;
            this.cases = Array.apply(null, Array(data.rateIt.maxRateItValue)).map(function (value, index) {
                return _this.createCase(index + 1, data.rateIt.rateType);
            });
            this.sent().then(function (sent) {
                if (sent.selectedValue) {
                    _this.selectedValue = sent.selectedValue;
                    _this.selectAnswer(sent);
                }
            });
        }
        /**
         * Rateit is unique in a way it shows results. Typically it's the cases matter to show them, but here it's
         * the page that has results, so the method is required here.
         * @returns {boolean} Should the result be shown?
         */
        Rateit.prototype.shouldShowResults = function () {
            return this.settings.showResults && this.result > 0;
        };
        Rateit.prototype.createCase = function (ordinal, symbol) {
            return new Page.IterationCase(this, { ordinal: ordinal, symbol: symbol });
        };
        Rateit.prototype.selectAnswer = function (sent) {
            var _this = this;
            if (sent.selectedValue) {
                this.filled = true;
                this.selectedValue = sent.selectedValue;
            }
            if (sent.result) {
                this.result = sent.result;
            }
            this.cases.map(function (vcase) {
                vcase.selected = sent.selectedValue >= vcase.ordinal;
                if (sent.selectedValue === vcase.ordinal) {
                    _this.engageform.sendAnswerCallback(_this.engageform.title || _this.engageform.id, _this.engageform.current ? _this.engageform.current.title || _this.engageform.current.id : null, vcase);
                }
            });
        };
        Rateit.prototype.setResults = function (results) {
            this.result = results.average;
            this.selectedValue = results.average;
        };
        return Rateit;
    }(Page.Page));
    Page.Rateit = Rateit;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Page;
(function (Page) {
    var StartPage = (function (_super) {
        __extends(StartPage, _super);
        function StartPage(engageform, data) {
            _super.call(this, engageform, data);
            this.type = Page.Type.StartPage;
            this.isCoverPage = true;
            if (data.coverPage && data.coverPage.buttonText !== undefined) {
                this.button = data.coverPage.buttonText;
            }
        }
        return StartPage;
    }(Page.Page));
    Page.StartPage = StartPage;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Page;
(function (Page) {
    var Buzzer = (function (_super) {
        __extends(Buzzer, _super);
        function Buzzer(engageform, data) {
            _super.call(this, engageform, data);
            this.type = Page.Type.Buzzer;
            this.buttonClickSum = 0;
            this._connected = false;
            // Make only one case with buzzed ammount
            this.cases.push(new Page.BuzzCase(this, { _id: 0, buttonClickSum: this.buttonClickSum }));
            // Clear previous timeout
            if (this._timeout) {
                Bootstrap.$timeout.cancel(this._timeout);
            }
            // Start loop
            this.buzzLoop(0);
            // FIXME: Relpace when themes will be ready
            // this.buzzerTheme = data.buzzerTheme;
            this.buzzerTheme = Bootstrap.config.fakeBuzzerTheme || {};
        }
        Buzzer.prototype.buzzLoop = function (iteration) {
            var _this = this;
            if (!this._connected) {
                this._connected = true;
            }
            if (this.buttonClickSum > 0) {
                this._connected = true;
                // True send - POST to server, we dont need then here since socket respond with global buttonClickSum
                this.cases[0].trueBuzzerSend(this.buttonClickSum);
                this.cases[0].buttonClickSum = this.buttonClickSum;
                this.engageform.sendAnswerCallback(this.engageform.title || this.engageform.id, this.engageform.current ? this.engageform.current.title || this.engageform.current.id : null, this.cases[0]);
            }
            // Not a buzzer - stop cycle
            if (iteration > 0 && this.engageform && this.engageform.current && this.engageform.current.id !== this.id) {
                return;
            }
            // Loop
            this._timeout = Bootstrap.$timeout(function () {
                _this.buzzLoop(iteration + 1);
            }, 3000);
            // Clear buttonClickSum
            this.buttonClickSum = 0;
        };
        Buzzer.prototype.clickBuzzer = function () {
            // Limit buzzes
            if (this.buttonClickSum < 100) {
                this.buttonClickSum++;
            }
        };
        return Buzzer;
    }(Page.Page));
    Page.Buzzer = Buzzer;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Page;
(function (Page) {
    var Poster = (function (_super) {
        __extends(Poster, _super);
        function Poster(engageform, data) {
            _super.call(this, engageform, data);
            this.type = Page.Type.Poster;
        }
        return Poster;
    }(Page.Page));
    Page.Poster = Poster;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Page;
(function (Page) {
    var SummaryPage = (function (_super) {
        __extends(SummaryPage, _super);
        function SummaryPage(engageform, data) {
            _super.call(this, engageform, data);
            this.type = Page.Type.SummaryPage;
            if (data.text) {
                this.title = data.text;
            }
            else {
                if (engageform.type === Engageform.Type.Outcome) {
                    this.title = 'Outcomes';
                }
                else {
                    this.title = 'Scores';
                }
            }
            this.stats = data.stats;
        }
        return SummaryPage;
    }(Page.Page));
    Page.SummaryPage = SummaryPage;
})(Page || (Page = {}));
})(angular);
//# sourceMappingURL=engageform.js.map
