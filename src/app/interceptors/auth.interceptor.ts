import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let modifiedReq = req;
  if (req.url.includes('/login')) {
    modifiedReq = req.clone({
      setHeaders: {
        authority: 'testnode.propelapps.com',
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9',
        authorization: 'Basic c3lzYWRtaW46U3F1ZWV6ZUAzMjE=',
        'content-language': 'en-US',
        'content-type': 'application/json',
      },
    });
  } else if (req.url.includes('getInventoryOrganizationsTable')) {
    modifiedReq = req.clone({
      setHeaders: {
        authority: 'testnode.propelapps.com',
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'from-cache': 'false',
        origin: 'https://localhost',
        referer: 'https://localhost/',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent':
          'Mozilla/5.0 (Linux; Android 12; CPH1933 Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/101.0.4951.61 Mobile Safari/537.36',
        'x-requested-with': 'com.propelapps.mobilesupplychain',
      },
    });
  } else {
    modifiedReq = req.clone({
      setHeaders: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return next(modifiedReq);
};
