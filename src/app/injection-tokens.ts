import { InjectionToken } from '@angular/core';

export const INJECTABLES = {
    ApiBase: new InjectionToken<string>("ApiBase"),
    LogApi: new InjectionToken<string>("LogApi"),
};
