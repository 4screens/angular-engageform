/// <reference path="iliveevent.ts" />

// FIXME: Drop static for function
module Liveevent {
  export class Liveevent implements ILiveevent {
    enabled: boolean;
    title: string;
    activePage: Page.IPage;
    activeQuiz: Page.IPage;
    activePageId: string;
    activeQuizId: string;

    // FIXME: Init sockets here
    constructor(opts: API.ILiveEmbed) {
      console.log('LE constructor');

      // Init
      this.Liveevent.init(opts);
    }

    static connectToSocket(opts: API.ILiveEmbed) {
      console.log('> > Init socket');
      var url = Bootstrap.config.backend.domain + Bootstrap.config.liveEvent.socketNamespace, socket;
      url = url.replace(':liveEventId', opts.id);
      socket = opts.io(url);

      socket.on('connect', () => {
        console.log(socket);

        socket.emit('getStatus', { liveEventId: opts.id });
      });

      socket.on('liveEventStatus', (data) => {
        console.log(data);
      });
    }

    static getById(id: string): ng.IPromise<API.ILiveevent> {
      console.log('> > LE getById');
      var url = Bootstrap.config.backend.domain + Bootstrap.config.liveEvent.liveEventUrl;
      url = url.replace(':liveEventId', id);

      // TODO: Get quiz and current question
      return Bootstrap.$http.get(url).then((res: API.ILiveeventResponse) => {
        if ([200, 304].indexOf(res.status) !== -1) {
          console.log(res.data);
          return res.data;
        }

        return Bootstrap.$q.reject(res);
      });
    }

    static getPageById(questionId: string): ng.IPromise<API.IQuizQuestion> {
      console.log('> > LE getPageById');
      var url = Bootstrap.config.backend.domain + Bootstrap.config.liveEvent.activeQuestion;
      url = url.replace(':questionId', questionId);

      return Bootstrap.$http.get(url).then(function(res) {

        if ([200, 304].indexOf(res.status) !== -1) {
          console.log(res.data);
          return res.data;
        }

          this.$q.reject(res);
      });
    }

    static init(opts: API.ILiveEmbed) {
      console.log('> Init: ' + opts.id);

      // Get socket
      this.socket = this.connectToSocket(opts);

      // Get Liveevent
      return this.getById(opts.id).then((liveeventData) => {
        this.enabled = liveeventData.isActive || false;

        // FIXME: REMOVE FAKE QUIZID
        this.activeQuizId = liveeventData.activeQuizId || '55a92a97b596220100fb090c';

        // FIXME: REMOVE FAKE PAGEID
        this.activePageId = liveeventData.activePageId || '55a92a9ab596220100fb090d';

        // Get Quiz
        Engageform.Live.getById(this.activeQuizId).then((quizData) => {
          this.activeQuiz = quizData;

          // Get Question
          // FIXME: MOVEIT to engagenow - /engageform/type/live.ts
          this.getPageById(this.activePageId).then((quizData) => {
            this.activePage = quizData;
            this._engageform = new Engageform.Live(this.activeQuiz);
            this._engageform.initPages([this.activePage]);
          });
        });
      });
    }
  }
}