module Navigation {
  export interface INavigation {
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

    start($event): void;
    prev($event): void;
    next($event): void;
    finish($event): void;
  }
}
