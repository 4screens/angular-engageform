/// <reference path="../src/api/api.ts" />

describe('Navigation:', () => {
  var Engageform: any;
  var ef: any;
  var httpBackend: any;
  var scope: any;
  var apiConfigMock: any;
  var $timeout;

  beforeEach(() => {
    // load the module
    module('4screens.engageform');

    apiConfigMock = {
      backend: {
        api: '/api',
        domain: '/domain',
        imagesUrl: '/imgUrl',
        branding: {
          text: 'text',
          link: 'link',
          imageUrl: '/url'
        }
      },
      engageform: {
        engageformUrl: '/engageform/:engageformId',
        engageformPagesUrl: '/engageform/:engageformId/pages'
      },
      cloudinary: {
        accountName: 'mockAccount',
        uploadFolder: 'mockUpload',
        domain: 'mockDomain'
      }
    };
    module(($provide) => {
      $provide.value('ApiConfig', apiConfigMock);
    });

    inject((_Engageform_, $injector, _$timeout_) => {
      $timeout = _$timeout_;
      Engageform = _Engageform_;
      httpBackend = $injector.get('$httpBackend');
      scope = $injector.get('$rootScope');

      jasmine.getJSONFixtures().fixturesPath = 'base/test/mock/';
    });
  });

  beforeEach(() => {
    httpBackend.whenGET('/domain/engageform/55893267d5f6db0100d2b09e').respond(
      getJSONFixture('engageform/55893267d5f6db0100d2b09e.json')
    );
    httpBackend.whenGET('/domain/engageform/55893267d5f6db0100d2b09e/pages').respond(
      getJSONFixture('pages/55893267d5f6db0100d2b09e.json')
    );
  });

  beforeEach(() => {
    Engageform.init(<API.IEmbed>{
      id: '55893267d5f6db0100d2b09e'
    }).then((engageform) => {
      ef = engageform;
    });

    httpBackend.flush();
  });

  // make sure no expectations were missed in your tests.
  // (e.g. expectGET or expectPOST)
  afterEach(() => {
    // remove all existing instances
    Engageform.destroyInstances();
    //httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('Properties:', () => {
    it('should hava enabled property', () => {
      expect(ef.navigation.enabled).toBeDefined();
      expect(ef.navigation.enabled).toMatch(/true|false/);
    });
    it('should hava position property', () => {
      expect(ef.navigation.position).toBeDefined();
      expect(ef.navigation.position).toMatch(/\d{1,}/);
    });
    it('should hava size property', () => {
      expect(ef.navigation.size).toBeDefined();
      expect(ef.navigation.size).toMatch(/\d{1,}/);
    });
    it('should hava hasStart property', () => {
      expect(ef.navigation.hasStart).toBeDefined();
      expect(ef.navigation.hasStart).toMatch(/true|false/);
    });
    it('should hava enabledStart property', () => {
      expect(ef.navigation.enabledStart).toBeDefined();
      expect(ef.navigation.enabledStart).toMatch(/true|false/);
    });
    it('should hava hasPrev property', () => {
      expect(ef.navigation.hasPrev).toBeDefined();
      expect(ef.navigation.hasPrev).toMatch(/true|false/);
    });
    it('should hava enabledPrev property', () => {
      expect(ef.navigation.enabledPrev).toBeDefined();
      expect(ef.navigation.enabledPrev).toMatch(/true|false/);
    });
    it('should hava hasNext property', () => {
      expect(ef.navigation.hasNext).toBeDefined();
      expect(ef.navigation.hasNext).toMatch(/true|false/);
    });
    it('should hava enabledNext property', () => {
      expect(ef.navigation.enabledNext).toBeDefined();
      expect(ef.navigation.enabledNext).toMatch(/true|false/);
    });
    it('should hava hasFinish property', () => {
      expect(ef.navigation.hasFinish).toBeDefined();
      expect(ef.navigation.hasFinish).toMatch(/true|false/);
    });
    it('should hava enabledFinish property', () => {
      expect(ef.navigation.enabledFinish).toBeDefined();
      expect(ef.navigation.enabledFinish).toMatch(/true|false/);
    });
  });

  describe('Declaration:', () => {
    it('should respond to start method', () => {
      expect(ef.navigation.start).toBeDefined();
    });
    it('should respond to finish method', () => {
      expect(ef.navigation.finish).toBeDefined();
    });
    it('should respond to prev method', () => {
      expect(ef.navigation.prev).toBeDefined();
    });
    it('should respond to next method', () => {
      expect(ef.navigation.start).toBeDefined();
    });
    it('should respond to next method', () => {
      expect(ef.navigation.start).toBeDefined();
    });
    it('should respond to pick method', () => {
      expect(ef.navigation.pick).toBeDefined();
    });
  });

  describe('Action:', () => {
    it('should start', () => {
      expect(ef.current.id).toBe('55893267d5f6db0100d2b09f');
      ef.navigation.start(null);
      scope.$digest();
      expect(ef.current.id).toBe('55893267d5f6db0100d2b0a0');
    });

    // FIXME: those test are not working correctly.
    //it('should go to the next page', () => {
    //  ef.navigation.start(null);
    //  scope.$digest();
    //  expect(ef.current.id).toBe('55893267d5f6db0100d2b0a0');
    //  ef.navigation.pick(null, null);
    //  scope.$digest();
    //  $timeout.flush(3001);
    //  expect(ef.current.id).toBe('55893267d5f6db0100d2b0a4');
    //});
    //it('should go to the prev page', () => {
    //  ef.navigation.start(null);
    //  scope.$digest();
    //  ef.navigation.pick(null, null);
    //  scope.$digest();
    //
    //  // TU
    //  expect(ef.current.id).toBe('55893267d5f6db0100d2b0a4');
    //  ef.navigation.prev(null);
    //  //scope.$digest();
    //  $timeout.flush(3001);
    //  expect(ef.current.id).toBe('55893267d5f6db0100d2b0a0');
    //});
    //it('should block if require', () => {
    //  ef.navigation.start(null);
    //  scope.$digest();
    //  ef.navigation.pick(null, null);
    //  scope.$digest();
    //  expect(ef.current.id).toBe('55893267d5f6db0100d2b0a0');
    //  expect(ef.message).not.toBe('');
    //});
  });
});
