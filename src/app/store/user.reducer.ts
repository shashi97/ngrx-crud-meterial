import { createReducer, on } from '@ngrx/store';
import { User } from '../model/user';
import { retrievedUserList } from './user.action';

export const initialState: Array<User> = [];

const _userReducer = createReducer(
  initialState,
  on(retrievedUserList, (state, { allUser }) => {
    return [...allUser];
  })
);

export function userReducer(state: any, action: any) {
  return _userReducer(state, action);
}
