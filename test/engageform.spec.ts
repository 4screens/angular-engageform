describe('Engageform:', () => {
  var Engageform: any;
  var httpBackend: any;
  var apiConfigMock: any;

  beforeEach(() => {
    // load the module
    module('4screens.engageform');

    apiConfigMock = {
      backend: {
        api: 'api',
        domain: ''
      },
      engageform: {
        engageformUrl: '/engageform/:engageformId',
        engageformPagesUrl: '/engageform/:engageformId/pages'
      }
    };
    module(($provide) => {
      $provide.value('ApiConfig', apiConfigMock);
    });

    inject((_Engageform_, $injector) => {
      Engageform = _Engageform_;
      httpBackend = $injector.get('$httpBackend');

      jasmine.getJSONFixtures().fixturesPath = 'base/test/mock/';
    });
  });

  beforeEach(() => {
    httpBackend.whenGET('/engageform/55893267d5f6db0100d2b0bf').respond(
      getJSONFixture('engageform/55893267d5f6db0100d2b0bf.json')
    );
    httpBackend.whenGET('/engageform/55893267d5f6db0100d2b0f7').respond(
      getJSONFixture('engageform/55893267d5f6db0100d2b0f7.json')
    );
    httpBackend.whenGET('/engageform/55893267d5f6db0100d2b09e').respond(
      getJSONFixture('engageform/55893267d5f6db0100d2b09e.json')
    );
    httpBackend.whenGET('/engageform/55893267d5f6db0100d2b09e?preview').respond(
      getJSONFixture('engageform/55893267d5f6db0100d2b09e.json')
    );
    httpBackend.whenGET('/engageform/55893267d5f6db0100d2b068').respond(
      getJSONFixture('engageform/55893267d5f6db0100d2b068.json')
    );
    httpBackend.whenGET('/engageform/55893267d5f6db0100d2b0bf/pages').respond(
      getJSONFixture('pages/55893267d5f6db0100d2b0bf.json')
    );
    httpBackend.whenGET('/engageform/55893267d5f6db0100d2b0f7/pages').respond(
      getJSONFixture('pages/55893267d5f6db0100d2b0f7.json')
    );
    httpBackend.whenGET('/engageform/55893267d5f6db0100d2b09e/pages').respond(
      getJSONFixture('pages/55893267d5f6db0100d2b09e.json')
    );
    httpBackend.whenGET('/engageform/55893267d5f6db0100d2b09e/pages?preview').respond(
      getJSONFixture('pages/55893267d5f6db0100d2b09e.json')
    );
    httpBackend.whenGET('/engageform/55893267d5f6db0100d2b068/pages').respond(
      getJSONFixture('pages/55893267d5f6db0100d2b068.json')
    );
  });

  // make sure no expectations were missed in your tests.
  // (e.g. expectGET or expectPOST)
  afterEach(() => {
    //httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('Definition:', () => {
    it('should be defined', () => {
      expect(Engageform).toBeDefined();
    });
    it('should have enumerated mode data', () => {
      expect(Engageform.Mode.Undefined).not.toBeNull();
    });
    it('should have enumerated type data', () => {
      expect(Engageform.Type.Undefined).not.toBeNull();
    });
  });

  describe('Initialize:', () => {
    it('should respond to init method', () => {
      expect(Engageform.init).toBeDefined();
    });
    it('should catch required property', (done) => {
      Engageform.init().catch((res) => {
        expect(res.status).toBe('error');
        expect(res.error.code).toBe(406);
        done();
      });

      httpBackend.flush();
    });
    it('should catch wrong mode property', (done) => {
      Engageform.init({
        id: 'init',
        mode: 'unsupported'
      }).catch((res) => {
        expect(res.status).toBe('error');
        expect(res.error.code).toBe(406);
        done();
      });

      httpBackend.flush();
    });
  });

  describe('Type:', () => {
    it('should get/set as "outcome"', (done) => {
      Engageform.init({
        id: '55893267d5f6db0100d2b09e'
      }).then((ef) => {
        expect(ef.type).toBe(Engageform.Type.Outcome);
        done();
      });

      httpBackend.flush();
    });
    it('should get/set as "poll"', (done) => {
      Engageform.init({
        id: '55893267d5f6db0100d2b068'
      }).then((ef) => {
        expect(ef.type).toBe(Engageform.Type.Poll);
        done();
      });

      httpBackend.flush();
    });
    it('should get/set as "score"', (done) => {
      Engageform.init({
        id: '55893267d5f6db0100d2b0bf'
      }).then((ef) => {
        expect(ef.type).toBe(Engageform.Type.Score);
        done();
      });

      httpBackend.flush();
    });
    it('should get/set as "survey"', (done) => {
      Engageform.init({
        id: '55893267d5f6db0100d2b0f7'
      }).then((ef) => {
        expect(ef.type).toBe(Engageform.Type.Survey);
        done();
      });

      httpBackend.flush();
    });
  });

  describe('Mode:', () => {
    it('should be set to "default" (default)', (done) => {
      Engageform.init({
        id: '55893267d5f6db0100d2b09e'
      }).then(() => {
        expect(Engageform.mode).toBe(Engageform.Mode.Default);
        done();
      });

      httpBackend.flush();
    });
    it('should be set to "default" (empty string)', (done) => {
      Engageform.init({
        id: '55893267d5f6db0100d2b09e',
        mode: ''
      }).then(() => {
        expect(Engageform.mode).toBe(Engageform.Mode.Default);
        done();
      });

      httpBackend.flush();
    });
    it('should be set to Mode.Preview', (done) => {
      Engageform.init({
        id: '55893267d5f6db0100d2b09e',
        mode: 'preview'
      }).then(() => {
        expect(Engageform.mode).toBe(Engageform.Mode.Preview);
        done();
      });

      httpBackend.flush();
    });
    it('should be set to Mode.Summary', (done) => {
      Engageform.init({
        id: '55893267d5f6db0100d2b09e',
        mode: 'summary'
      }).then(() => {
        expect(Engageform.mode).toBe(Engageform.Mode.Summary);
        done();
      });

      httpBackend.flush();
    });
    it('should be set to Mode.Result', (done) => {
      Engageform.init({
        id: '55893267d5f6db0100d2b09e',
        mode: 'result'
      }).then(() => {
        expect(Engageform.mode).toBe(Engageform.Mode.Result);
        done();
      });

      httpBackend.flush();
    });
  });

  describe('Data:', () => {
    it('should response to title property', (done) => {
      Engageform.init({
        id: '55893267d5f6db0100d2b09e'
      }).then((ef) => {
        expect(ef.title).toBe('Example: Which office superhero are you?');
        done();
      });

      httpBackend.flush();
    });
    it('should response to theme property', (done) => {
      Engageform.init({
        id: '55893267d5f6db0100d2b09e'
      }).then((ef) => {
        expect(ef.theme.answerBackgroundColor).toBe('rgba(43,62,79,0.56)');
        expect(ef.theme.answerBorderColor).toBe('');
        expect(ef.theme.answerColor).toBe('#ffffff');
        expect(ef.theme.backgroundBrightness).toBe('50');
        expect(ef.theme.backgroundColor).toBe('#000000');
        expect(ef.theme.backgroundImageBlur).toBe('4');
        expect(ef.theme.backgroundImageFile).toBe('5582dd952e01950100cd5fb0.jpg');
        expect(ef.theme.backgroundImagePosition).toBe('fill');
        expect(ef.theme.buttonColor).toBe('#63b3e0');
        expect(ef.theme.font).toBe('Open Sans');
        expect(ef.theme.questionColor).toBe('#ffffff');
        expect(ef.theme.customThemeCssFile).toBe('api/uploads/themes/e/9/0/55893267d5f6db0100d2b09e_theme.css');
        done();
      });

      httpBackend.flush();
    });
    it('should response to settings property', (done) => {
      Engageform.init({
        id: '55893267d5f6db0100d2b09e'
      }).then((ef) => {
        expect(ef.settings.allowAnswerChange).toBeFalsy();
        done();
      });

      httpBackend.flush();
    });
  });

});
