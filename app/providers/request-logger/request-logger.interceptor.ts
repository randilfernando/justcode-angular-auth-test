import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/do";
import { Injectable } from "@angular/core";

import { LOGIN_URL, REFRESH_URL, SECURED_URL } from "../../config/api.config";

@Injectable()
export class RequestLoggerInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).do((event: HttpEvent<any>) => {
      if (event instanceof HttpRequest) {
        switch (req.url) {
          case LOGIN_URL:
            console.log("login request is sent");
            console.log("request body: ", req.body);
            break;
          case REFRESH_URL:
            console.log("refresh token request is sent");
            break;
          case SECURED_URL:
            console.log("secured request sent");
        }
      }
      if (event instanceof HttpResponse && !(event instanceof HttpErrorResponse)) {
        switch (req.url) {
          case LOGIN_URL:
            console.log("auth received: ", event.body);
            break;
          case REFRESH_URL:
            console.log("auth received: ", event.body);
            break;
          case SECURED_URL:
            console.log("authorization: ", req.headers.get("Authorization"));
        }
      }
    });
  }
}
