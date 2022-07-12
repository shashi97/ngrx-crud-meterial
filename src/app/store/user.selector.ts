import { createSelector } from '@ngrx/store';
import { User } from '../model/user';

import { AppState } from './app.state';

export const userSelector =(state: AppState) => state.user;

export const uniqueAlbumIds = createSelector(
  userSelector,
  (user: User[]) => {
    return [...new Set(user.map((_) => _.id))];
  }
);

export const albumCollectionByIndex = (index:number) => createSelector(
    userSelector,
    (user:User[]) => {
        if(index == -1){
            return user;
        }
        return user.filter(_ => _.id == index);
    }
)
