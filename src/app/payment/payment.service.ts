import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isNumber } from 'util';

import { Injectable } from '@angular/core';

import { CustomError, Result } from '../railway.model';
import { RailwayService } from '../railway.service';

interface ServerResponse {
  message: string;  // for demonstration purposes only
}

interface ServerError {
  error: string;
}

@Injectable(
  { providedIn: 'root' }
)
export class PaymentService {

  constructor(private railway: RailwayService) { }

  save(payload: any): Observable<Result<ServerResponse>> {
    // this.railway.validate(4);
    return of(Result.Success({ message: '' }))
  }

  post(payload: any): Observable<ServerResponse> {
    return of(
      { message: 'Card Saved' } as ServerResponse
    );
  }
}
