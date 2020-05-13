import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { CustomError, Result } from '../railway.model';

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

  validate(payload) {
    return !!payload;
  }

  save(payload: any): Observable<Result<ServerResponse>> {
    const isValid = this.validate(payload);

    if (!isValid) {
      return of(
        Result.Fail(new Error('Invalid card'))
      );
    }

    try {
      return this.post(payload).pipe(
        map(Result.Success),
        catchError(error =>
          of(Result.Fail(new Error(error)))
        )
      );
    }
    catch (exception) {
      return of(
        Result.Fail(new Error('Server Error'))
      );
    }
  }

  post(payload: any): Observable<ServerResponse> {
    return of(
      { message: 'Card Saved' } as ServerResponse
    );
  }
}
