import { Component, DefaultIterableDiffer, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Store, select } from '@ngrx/store';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { User, UserColumns } from './model/user';
import { UserService } from './services/user.service';
import { retrievedUserList, invokeUserAPI } from './store/user.action';
import {
  uniqueAlbumIds,
  albumCollectionByIndex,
} from './store/user.selector';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
}) 
export class AppComponent {
  displayedColumns: string[] = UserColumns.map((col) => col.key);
  columnsSchema: any = UserColumns;
  selectedUserId = -1;
  dataSource = new MatTableDataSource<User>();
  dataSources$ = this.store.pipe(
    select(albumCollectionByIndex(this.selectedUserId))
  );
  valid: any = {};

  constructor(public dialog: MatDialog, private userService: UserService,
    private store: Store<{ user: User[] }>) {}

  ngOnInit() {
    this.store.dispatch(invokeUserAPI());
    this.userService.getUsers().subscribe((user:User[]) => {
      console.log(user);
      this.dataSource.data = user;
      // this.store.dispatch(
      //   retrievedUserList({ allUser: this.dataSource.data,  userLength: user.length })
      // );
    });
  }

  editRow(row: User) {
    if (row.id === 0) {
      this.userService.addUser(row).subscribe((newUser: User) => {
        row.id = newUser.id;
        row.isEdit = false;
      });
    } else {
      this.userService.updateUser(row).subscribe(() => (row.isEdit = false));
    }
  }

  addRow() {
    const newRow: User = {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      birthDate: '',
      isEdit: true,
      isSelected: false,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  removeRow(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(
        (u: User) => u.id !== id
      );
    });
  }

  removeSelectedRows() {
    const users = this.dataSource.data.filter((u: User) => u.isSelected);
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.userService.deleteUsers(users).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (u: User) => !u.isSelected
            );
          });
        }
      });
  }

  inputHandler(e: any, id: number, key: string) {
    if (!this.valid[id]) {
      this.valid[id] = {};
    }
    this.valid[id][key] = e.target.validity.valid;
  }

  disableSubmit(id: number) {
    if (this.valid[id]) {
      return Object.values(this.valid[id]).some((item) => item === false);
    }
    return false;
  }
}
