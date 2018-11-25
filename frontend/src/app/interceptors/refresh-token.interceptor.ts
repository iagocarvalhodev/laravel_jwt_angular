
import { Injectable, Injector } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse, HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";
import { Observable } from "rxjs/Rx";



@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector){}


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).catch((errorResponse: HttpErrorResponse)=>{
      const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse;

      if(errorResponse.status === 401 && error.error === 'token_expired') {
        const http = this.injector.get(HttpClient);

        return http.post<any>(`${environment.api_url}/auth/refresh`, {})
          .flatMap(data => {
            localStorage.setItem('token', data.token);
            const cloneRequest = req.clone({ setHeaders: {'Authorrization': `Bearer ${data.token}`} });

            return next.handle(cloneRequest);
          });
      }

      return Observable.throw(errorResponse);


    });







      return next.handle(req);


  }
}
