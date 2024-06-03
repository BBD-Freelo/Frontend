import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { AddBoard } from '../../interfaces/components/addBoard';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddBoardRequest } from '../../interfaces/Requests/addBoard';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatInputModule,
    MatButton,
    MatIcon,
    MatIconButton,
    FormsModule,
    MatSelect,
    MatOption,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatChipsModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './board-dialog.component.html',
  styleUrl: './board-dialog.component.css'
})
export class BoardDialogComponent {
  formGroup = new FormGroup({
    titleControl: new FormControl('', [Validators.maxLength(20), Validators.pattern("^[a-zA-Z0-9.,?!/ ]*$")]),
    privacyControl: new FormControl('', [Validators.required]),
    collaboratorsControl: new FormControl('', [Validators.required]),
  })
  userList: number[] = [];
  collaboratorList: number[] = [];
  collaboratorEmailList: string[] = [];


  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<BoardDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: AddBoard,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  getCollaboratorByEmail(email: string | null): void {
    
    
  }

  addCollaborator(): void {
    const email: string = this.formGroup.controls.collaboratorsControl.value ?? '';
    this.collaboratorEmailList.push(email);
    this.apiService.get<number>(`/user/id/${email}`).subscribe((data) => {
      this.userList.push(data);
    });

  }

  removeCollaborator(index: number): void {
    this.collaboratorList.splice(index, 1);
  }

  createBoard(): void {
    if (this.formGroup.controls.titleControl.invalid) return;

    const privacyBoolean: boolean = this.formGroup.controls.privacyControl.value === '' ? false : true;

    if (this.userList.length > 0) {
      const jsonList = JSON.stringify(this.userList);
      const stringUserList = JSON.parse(jsonList);
      this.collaboratorList = stringUserList.map((user: any) => user.userId);   
    }
    else {
      this.collaboratorList = this.userList;
    }

    let addBoardRequest : AddBoardRequest = {
      boardCollaborators : this.collaboratorList,
      boardName: this.formGroup.controls.titleControl.value ?? '',
      isPublic: privacyBoolean
    };

    this.dialogRef.close(addBoardRequest);
  }

}
