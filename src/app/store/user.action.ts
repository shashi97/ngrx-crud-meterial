import { createAction, props } from '@ngrx/store';
import { User } from '../model/user';

export const retrievedUserList = createAction(
  '[User API] User API Success',
  props<{ allUser: User[], userLength:number }>()
);

export const invokeUserAPI = createAction('[User API] Invoke API');
