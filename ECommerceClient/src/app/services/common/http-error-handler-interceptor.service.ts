import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {

  constructor(private toastrService: CustomToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error => {
      switch (error.status) {
        case HttpStatusCode.Unauthorized:
          this.toastrService.message("you are not authorized !!", "Unauthorized", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          break;
        case HttpStatusCode.InternalServerError:
          this.toastrService.message("you did not access server !!", "InternalServerError", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          break;
        case HttpStatusCode.BadRequest:
          this.toastrService.message("your request is invalid !!", "BadRequest", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          break;
        case HttpStatusCode.NotFound:
          this.toastrService.message("page cannot be found !!", "NotFound", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          break;
        default:
          this.toastrService.message("unexpected error occurred. !!", "UnexpectedError", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          break;
      }
      return of(error);
    }))
  }
}