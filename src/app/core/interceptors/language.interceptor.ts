import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SettingsService } from '../settings.service';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
    const settings = inject(SettingsService);

    const modifiedReq = req.clone({
        setHeaders: {
            'Accept-Language': settings.lang(),
        },
    });

    return next(modifiedReq);
};