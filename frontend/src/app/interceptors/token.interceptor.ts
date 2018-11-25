import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { environment } from "../../environments/environment";



@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const requestUrl: Array<any> = req.url.split('/');
    const apiUrl: Array<any> = environment.api_url.split('/');
    const token = localStorage.getItem('token');

    if(token && (requestUrl[2] === apiUrl[2])){

      const newRequest = req.clone({ setHeaders: { 'Authorization': `Bearer ${token}` } });
      return next.handle(newRequest);

    }else {
      return next.handle(req);
    }

  }
}
