export default interface NavigationProperties {
  enabled: boolean;
  position: number;
  size: number;
  hasStart: boolean;
  enabledStart: boolean;
  hasPrev: boolean;
  enabledPrev: boolean;
  hasNext: boolean;
  enabledNext: boolean;
  hasFinish: boolean;
  enabledFinish: boolean;
  distance: number;
  animate: string;

  hasStartPages: boolean;
  hasEndPages: boolean;

  start($event: any): void;

  prev($event: any): void;

  pick($event: any, vcase: Page.ICase): void;

  next($event: any, vcase: Page.ICase): void;

  finish($event: any, vcase: Page.ICase): void;
}
