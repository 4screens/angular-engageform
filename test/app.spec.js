describe("App Module:", function() {
  var module;

  before(function() {
    module = angular.module("4screens.engageform");
  });

  it("should be registered", function() {
    expect(module).not.to.equal(null);
  });

  describe("Dependencies:", function() {
    var deps;
    var hasModule = function(m) {
      return deps.indexOf(m) >= 0;
    };

    before(function() {
      deps = module.value('appName').requires;
    });

    //you can also test the module's dependencies
    it.skip("should have 4screens.engageform.Controllers as a dependency", function() {
      expect(hasModule('4screens.engageform.Controllers')).to.equal(true);
    });

  });

});
