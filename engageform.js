(function(angular) {
/*!
 * 4screens-angular-engageform v0.2.45
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
    })(Page.Type || (Page.Type = {}));
    var Type = Page.Type;
})(Page || (Page = {}));

/// <reference path="../typings/tsd.d.ts" />
var app = angular.module('4screens.engageform', [
    '4screens.util.cloudinary',
    'LocalStorageModule'
]);

/// <reference path="iengageform.ts" />
/// <reference path="isendanswercallback.ts" />
var Engageform;
(function (Engageform_1) {
    var Engageform = (function () {
        function Engageform(data, sendAnswerCallback) {
            this._pages = {};
            this._startPages = [];
            this._endPages = [];
            this._availablePages = [];
            this._hasForms = false;
            this.sendAnswerCallback = function () { };
            this.enabled = true;
            this.type = Engageform_1.Type.Undefined;
            this._engageformId = data._id;
            this.sendAnswerCallback = sendAnswerCallback;
            this.title = data.title;
            this.settings = new Engageform_1.Settings(data);
            this.theme = new Engageform_1.Theme(data);
            this.tabs = new Engageform_1.Tabs(data);
            if (data.settings && data.settings.branding) {
                this.branding = new Branding.Branding(data.settings.branding);
            }
            else {
                this.branding = new Branding.Branding({});
            }
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
        Engageform.prototype.initPages = function () {
            var _this = this;
            return this.getPagesById(this._engageformId).then(function (pages) {
                _this.buildPages(pages);
                return _this;
            });
        };
        Engageform.prototype.initPage = function (page) {
            // ..Abstract for liveEvent
        };
        Engageform.prototype.setCurrent = function (pageId) {
            this.current = this._pages[pageId];
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
        Engageform.getById = function (id) {
            var url = Bootstrap.config.backend.domain + Bootstrap.config.engageform.engageformUrl;
            url = url.replace(':engageformId', id);
            if (Bootstrap.mode !== Engageform_1.Mode.Default) {
                url += '?preview';
            }
            return Bootstrap.$http.get(url).then(function (res) {
                if ([200, 304].indexOf(res.status) !== -1) {
                    return res.data;
                }
                return Bootstrap.$q.reject(res);
            });
        };
        Engageform.prototype.cleanPages = function () {
            this._availablePages.length = 0;
            this._pages = {};
        };
        Engageform.prototype.buildPages = function (pages) {
            var _this = this;
            pages.map(function (page) {
                switch (page.type) {
                    case 'multiChoice':
                        _this._availablePages.push(page._id);
                        _this._pages[page._id] = new Page.MultiChoice(_this, page);
                        break;
                    case 'pictureChoice':
                        _this._availablePages.push(page._id);
                        _this._pages[page._id] = new Page.PictureChoice(_this, page);
                        break;
                    case 'rateIt':
                        _this._availablePages.push(page._id);
                        _this._pages[page._id] = new Page.Rateit(_this, page);
                        break;
                    case 'forms':
                        // Store information about this engageform having a form-type question.
                        _this._hasForms = true;
                        _this._availablePages.push(page._id);
                        _this._pages[page._id] = new Page.Form(_this, page);
                        break;
                    case 'startPage':
                        _this._startPages.push(page._id);
                        _this._pages[page._id] = new Page.StartPage(_this, page);
                        break;
                    case 'endPage':
                        _this._endPages.push(page._id);
                        _this._pages[page._id] = new Page.EndPage(_this, page, _this.settings);
                        break;
                    // EngageNow exclusive page types
                    case 'buzzer':
                        _this._availablePages.push(page._id);
                        _this._pages[page._id] = new Page.Buzzer(_this, page);
                        break;
                    case 'poster':
                        _this._availablePages.push(page._id);
                        _this._pages[page._id] = new Page.Poster(_this, page);
                        break;
                }
            });
        };
        Engageform.prototype.getPagesById = function (engageformId) {
            var url = Bootstrap.config.backend.domain + Bootstrap.config.engageform.engageformPagesUrl;
            url = url.replace(':engageformId', engageformId);
            if (Bootstrap.mode !== Engageform_1.Mode.Default) {
                url += '?preview';
            }
            return Bootstrap.$http.get(url).then(function (res) {
                if ([200, 304].indexOf(res.status) !== -1) {
                    return res.data;
                }
                this.$q.reject(res);
            });
        };
        return Engageform;
    })();
    Engageform_1.Engageform = Engageform;
})(Engageform || (Engageform = {}));

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
            this.enabled = true;
            this.hasStart = false;
            this.move(null);
            this.hasPrev = true;
        };
        Navigation.prototype.prev = function ($event) {
            this.disableDefaultAction($event);
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
            var current = this._engageform.current;
            var isNormalMode = Bootstrap.mode === Engageform.Mode.Default || Bootstrap.mode === Engageform.Mode.Preview;
            this.disableDefaultAction($event);
            this.animate = 'swipeNext';
            // Send the answer.
            return current.send(vcase).then(function () {
                _this._engageform.message = '';
                // Prevent the question change when there's no answer selected and the page requires it.
                if (isNormalMode && !current.filled && current.settings.requiredAnswer) {
                    if (!opts.quiet) {
                        _this.sendMessage('Answer is required to proceed to the next question.');
                    }
                    return vcase;
                }
                else {
                    // Change the page with a slight delay, or do it instantly.
                    var pageChangeDelay = vcase ? (current.settings.showCorrectAnswer || current.settings.showResults ? 2000 : 200) : 0;
                    // Extend the change timeout when user selected another answer while waiting for change.
                    if (_this.waitingForPageChange) {
                        Bootstrap.$timeout.cancel(_this.waitingForPageChange);
                    }
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
                    _this.sendMessage(data.message);
                }
                return data;
            });
        };
        Navigation.prototype.move = function (vcase) {
            var _this = this;
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
                    this.hasFinish = !(this._engageform.isType(Engageform.Type.Poll) && !this._engageform.hasForms);
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
            this._engageform.message = msg || '';
            Bootstrap.$timeout(function () {
                _this._engageform.message = '';
            }, this._engageform.settings.hideMessageAfterDelay);
        };
        return Navigation;
    })();
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
    })();
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
            if (this.settings.showMainMedia) {
                this.media = Bootstrap.cloudinary.prepareImageUrl(data.imageFile, 680, data.imageData);
                this.mediaWidth = 680;
                if (data.imageData.containerRatio) {
                    this.mediaHeight = Math.round(680 * data.imageData.containerRatio);
                }
                else {
                    this.mediaHeight = Math.round(data.imageData.containerHeight);
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
    })();
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
})();

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
    })();
    Util.Event = Event;
})(Util || (Util = {}));

/// <reference path="api/api.ts" />
/// <reference path="engageform/engageform.ts" />
/// <reference path="navigation/navigation.ts" />
/// <reference path="meta/meta.ts" />
/// <reference path="page/page.ts" />
/// <reference path="user/user.ts" />
/// <reference path="util/event.ts" />
var Bootstrap = (function () {
    function Bootstrap($http, $q, $timeout, cloudinary, localStorage, ApiConfig) {
        Bootstrap.$http = $http;
        Bootstrap.$q = $q;
        Bootstrap.$timeout = $timeout;
        Bootstrap.cloudinary = cloudinary;
        Bootstrap.localStorage = localStorage;
        Bootstrap.config = ApiConfig;
        Bootstrap.user = new User();
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
        if (Bootstrap._instances[opts.id]) {
            return Bootstrap._instances[opts.id];
        }
        switch (opts.mode) {
            case 'preview':
                Bootstrap.mode = Engageform.Mode.Preview;
                break;
            case 'summary':
                Bootstrap.mode = Engageform.Mode.Summary;
                break;
            case 'result':
                Bootstrap.mode = Engageform.Mode.Result;
                break;
            case 'default':
            case '':
            case undefined:
                Bootstrap.mode = Engageform.Mode.Default;
                break;
            default:
                return Bootstrap.$q.reject({
                    status: 'error',
                    error: {
                        code: 406,
                        message: 'Mode property not supported.'
                    },
                    data: opts
                });
        }
        if (!opts.callback) {
            opts.callback = {
                sendAnswerCallback: function () { }
            };
        }
        else if (!opts.callback.sendAnswerCallback) {
            opts.callback.sendAnswerCallback = function () { };
        }
        return Engageform.Engageform.getById(opts.id).then(function (engageformData) {
            switch (engageformData.type) {
                case 'outcome':
                    _this._engageform = new Engageform.Outcome(engageformData, opts.callback.sendAnswerCallback);
                    break;
                case 'poll':
                    _this._engageform = new Engageform.Poll(engageformData, opts.callback.sendAnswerCallback);
                    break;
                case 'score':
                    _this._engageform = new Engageform.Score(engageformData, opts.callback.sendAnswerCallback);
                    break;
                case 'survey':
                    _this._engageform = new Engageform.Survey(engageformData, opts.callback.sendAnswerCallback);
                    break;
                case 'live':
                    _this._engageform = new Engageform.Live(engageformData, opts.callback.sendAnswerCallback);
                    break;
                default:
                    return Bootstrap.$q.reject({
                        status: 'error',
                        error: {
                            code: 406,
                            message: 'Type property not supported.'
                        },
                        data: engageformData
                    });
            }
            return Bootstrap._instances[opts.id] = _this._engageform.initPages();
        }).then(function (engageform) {
            engageform.navigation = new Navigation.Navigation(engageform);
            engageform.meta = new Meta.Meta(engageform);
            return engageform;
        });
    };
    Bootstrap.prototype.destroyInstances = function () {
        Bootstrap._instances = {};
    };
    Bootstrap.mode = Engageform.Mode.Undefined;
    Bootstrap._instances = {};
    return Bootstrap;
})();
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
    })();
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
    })();
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
    })();
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
    })();
    Engageform.Tabs = Tabs;
})(Engageform || (Engageform = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
    })(Engageform.Engageform);
    Engageform.Outcome = Outcome;
})(Engageform || (Engageform = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
    })(Engageform.Engageform);
    Engageform.Poll = Poll;
})(Engageform || (Engageform = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
    })(Engageform.Engageform);
    Engageform.Score = Score;
})(Engageform || (Engageform = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
    })(Engageform.Engageform);
    Engageform.Survey = Survey;
})(Engageform || (Engageform = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
            // Clean old pages
            this.cleanPages();
            // Build new
            this.buildPages([page]);
            this.setCurrent(page._id);
        };
        Live.prototype.setCurrentEndPage = function () {
            var deferred = Bootstrap.$q.defer();
            deferred.resolve();
            return deferred.promise;
        };
        return Live;
    })(Engageform.Engageform);
    Engageform.Live = Live;
})(Engageform || (Engageform = {}));

/// <reference path="icase.ts" />
var Page;
(function (Page) {
    var Case = (function () {
        function Case(page, data) {
            this.type = Page.CaseType.Undefined;
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
    })();
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
    })();
    Page.Settings = Settings;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Page;
(function (Page) {
    var ImageCase = (function (_super) {
        __extends(ImageCase, _super);
        function ImageCase(page, data) {
            _super.call(this, page, data);
            this.type = Page.CaseType.Image;
            this.selected = false;
            this.correct = false;
            this.incorrect = false;
            this.title = data.text;
            this.media = Bootstrap.cloudinary.prepareImageUrl(data.imageFile, 300, data.imageData);
            this.mediaWidth = 300;
            if (data.imageData.containerRatio) {
                this.mediaHeight = Math.round(300 * data.imageData.containerRatio);
            }
            else {
                this.mediaHeight = Math.round(data.imageData.containerHeight);
            }
        }
        ImageCase.prototype.send = function () {
            var _this = this;
            if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
                return Bootstrap.$q.reject({ message: 'Changing answer is not allowed' });
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
    })(Page.Case);
    Page.ImageCase = ImageCase;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
    })(Page.Case);
    Page.InputCase = InputCase;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
                return Bootstrap.$q.reject({ message: 'Changing answer is not allowed' });
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
    })(Page.Case);
    Page.IterationCase = IterationCase;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Page;
(function (Page) {
    var TextCase = (function (_super) {
        __extends(TextCase, _super);
        function TextCase(page, data) {
            _super.call(this, page, data);
            this.type = Page.CaseType.Text;
            this.selected = false;
            this.correct = false;
            this.incorrect = false;
            this.title = data.text;
        }
        TextCase.prototype.send = function () {
            var _this = this;
            if (!this.page.engageform.settings.allowAnswerChange && this.page.filled) {
                return Bootstrap.$q.reject({ message: 'Changing answer is not allowed' });
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
    })(Page.Case);
    Page.TextCase = TextCase;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
    })(Page.Case);
    Page.BuzzCase = BuzzCase;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
                this.socialData.title = 'I got "' +
                    (this.engageform.typeName === 'score' ? ((this.score || 0) + ' percent') : (this.outcome || '')) +
                    '" on "' + this.engageform.title + '" quiz. What about you?';
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
    })(Page.Page);
    Page.EndPage = EndPage;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Page;
(function (Page) {
    var Form = (function (_super) {
        __extends(Form, _super);
        function Form(engageform, data) {
            var _this = this;
            _super.call(this, engageform, data);
            this.type = Page.Type.Form;
            if (!data.forms) {
                return;
            }
            data.forms.inputs.map(function (input) {
                _this.cases.push(new Page.InputCase(_this, input));
            });
            if (this.cases.length) {
                this.sent().then(function (sent) {
                    _this.selectAnswer(sent);
                });
            }
        }
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
            });
        };
        return Form;
    })(Page.Page);
    Page.Form = Form;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
            data.answers.map(function (answer) {
                _this.cases.push(new Page.TextCase(_this, answer));
            });
            if (this.cases.length) {
                this.sent().then(function (sent) {
                    _this.selectAnswer(sent);
                });
            }
        }
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
    })(Page.Page);
    Page.MultiChoice = MultiChoice;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
            data.answers.map(function (answer) {
                _this.cases.push(new Page.ImageCase(_this, answer));
            });
            if (this.cases.length) {
                this.sent().then(function (sent) {
                    _this.selectAnswer(sent);
                });
            }
        }
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
    })(Page.Page);
    Page.PictureChoice = PictureChoice;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
            for (var i = 1; i <= data.rateIt.maxRateItValue; i++) {
                this.cases.push(new Page.IterationCase(this, {
                    ordinal: i,
                    symbol: data.rateIt.rateType
                }));
            }
            this.sent().then(function (sent) {
                if (sent.selectedValue) {
                    _this.selectedValue = sent.selectedValue;
                    _this.selectAnswer(sent);
                }
            });
        }
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
        return Rateit;
    })(Page.Page);
    Page.Rateit = Rateit;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Page;
(function (Page) {
    var StartPage = (function (_super) {
        __extends(StartPage, _super);
        function StartPage(engageform, data) {
            _super.call(this, engageform, data);
            this.type = Page.Type.StartPage;
            this.button = 'Let\'s get started';
            this.isCoverPage = true;
            if (data.coverPage) {
                this.button = data.coverPage.buttonText || this.button;
            }
        }
        return StartPage;
    })(Page.Page);
    Page.StartPage = StartPage;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
    })(Page.Page);
    Page.Buzzer = Buzzer;
})(Page || (Page = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
    })(Page.Page);
    Page.Poster = Poster;
})(Page || (Page = {}));
})(angular);
//# sourceMappingURL=engageform.js.map