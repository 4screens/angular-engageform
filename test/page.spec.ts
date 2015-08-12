/// <reference path="../src/api/api.ts" />

describe('Page:', () => {
  var Engageform: any;
  var ef: any;
  var httpBackend: any;
  var scope: any;
  var apiConfigMock: any;

  beforeEach(() => {
    // load the module
    module('4screens.engageform');

    apiConfigMock = {
      backend: {
        api: '/api',
        domain: '/domain'
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
      scope = $injector.get('$rootScope');

      jasmine.getJSONFixtures().fixturesPath = 'base/test/mock/';
    });
  });

  beforeEach(() => {
    httpBackend.whenGET('/domain/engageform/55893267d5f6db0100d2b0f7').respond(
      getJSONFixture('engageform/55893267d5f6db0100d2b0f7.json')
    );
    httpBackend.whenGET('/domain/engageform/55893267d5f6db0100d2b0f7/pages').respond(
      getJSONFixture('pages/55893267d5f6db0100d2b0f7.json')
    );
  });

  beforeEach(() => {
    Engageform.init({
      id: '55893267d5f6db0100d2b0f7'
    }).then((engageform) => {
      ef = engageform;
    });

    httpBackend.flush();
  });

  // make sure no expectations were missed in your tests.
  // (e.g. expectGET or expectPOST)
  afterEach(() => {
    //httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

});
