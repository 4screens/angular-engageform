describe("module initialize", function() {
  var module;

  before(function() {
    module = angular.module("4screens.engageform");
  });

  it("should be registered", function() {
    expect(module).not.to.equal(null);
  });

  describe("module dependencies", function() {
    var hasModule = function(m) {
      return module.requires.indexOf(m) >= 0;
    };

    it("should have LocalStorageModule as a dependency", function() {
      expect(hasModule('LocalStorageModule')).to.equal(true);
    });
  });
});
