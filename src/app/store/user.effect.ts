import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable()
export class UserEffect {
  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User API] Invoke API'),
      mergeMap(() =>
        this.userService
          .getUsers()
          .pipe(map((data: any) => ({ type: '[User API] User API Success', allUser: data, userLength: data.length })))
      )
    )
  );
}
