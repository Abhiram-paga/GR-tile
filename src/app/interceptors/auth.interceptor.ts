import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let modifiedReq = req.clone({
    setHeaders: {
      authority: 'testnode.propelapps.com',
      accept: 'application/json',
      'accept-language': 'en-US,en;q=0.9',
      authorization: 'Basic c3lzYWRtaW46U3F1ZWV6ZUAzMjE=',
      'content-language': 'en-US',
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });

  return next(modifiedReq);
};
