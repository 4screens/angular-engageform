describe('Module:', () => {
  var module: ng.IModule;
  var hasModule = (m) => {
    return module.requires.indexOf(m) >= 0;
  };

  beforeEach(() => {
    module = angular.module('4screens.engageform');
  });

  it('should be registered', () => {
    expect(module).toBeDefined();
  });

  it('should have LocalStorageModule as a dependency', () => {
    expect(hasModule('LocalStorageModule')).toBe(true);
  });

});
