import { InjectionToken } from '@angular/core';

export const API_BASE_TOKEN = new InjectionToken<string>("ApiBase");
export const LOG_API_TOKEN = new InjectionToken<string>("LogApi");

export const INJECTABLES = {
    "ApiBase": API_BASE_TOKEN,
    "LogApi": LOG_API_TOKEN,
};
