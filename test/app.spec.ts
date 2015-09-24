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

  it('should have 4screens.util.cloudinary as a dependency', () => {
    expect(hasModule('4screens.util.cloudinary')).toBe(true);
  });

});
