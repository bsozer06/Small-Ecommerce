import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { List_Role } from 'src/app/contracts/role/List_Role';
import { RoleService } from 'src/app/services/common/models/role.service';
import { UserService } from 'src/app/services/common/models/user.service';
import { AuthorizeMenuDialogComponent, AuthorizeMenuState } from '../authorize-menu-dialog/authorize-menu-dialog.component';
import { BaseDialog } from '../base/base-dialog';

@Component({
  selector: 'app-authorize-user-dialog',
  templateUrl: './authorize-user-dialog.component.html',
  styleUrls: ['./authorize-user-dialog.component.scss']
})

export class AuthorizeUserDialogComponent extends BaseDialog<AuthorizeMenuDialogComponent> implements OnInit {

  constructor(
    dialogRef: MatDialogRef<AuthorizeMenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private roleService: RoleService,
    private userService: UserService,
    private spinner: NgxSpinnerService
  ) {
    super(dialogRef);
  }
  roles: { datas: List_Role[], totalCount: number };
  assignedRoles: string[];
  listRoles: { name: string, selected: boolean }[];

  async ngOnInit() {
    this.spinner.show(SpinnerType.BallAtom);
    this.assignedRoles = await this.userService.getRolesToUser(this.data, () =>
      this.spinner.hide(SpinnerType.BallAtom)
    );
    this.roles = await this.roleService.getRoles(-1, -1);

    this.listRoles = this.roles.datas.map((r: any) => {
      return {
        name: r.name,
        selected: this.assignedRoles?.indexOf(r.name) > -1
      }
    });



  }

  assignRoles(rolesComponent: MatSelectionList) {
    const roles: string[] = rolesComponent.selectedOptions.selected.map(o => o._text.nativeElement.innerText);
    this.spinner.show(SpinnerType.BallAtom);
    this.userService.assignRoleToUser(this.data, roles, () => {
      this.spinner.hide(SpinnerType.BallAtom);

    }, (error) => {

    })
  }

}

