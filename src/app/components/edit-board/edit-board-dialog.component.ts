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

interface User {
  email: string;
}

@Component({
  selector: 'app-edit-board-dialog',
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
  templateUrl: './edit-board-dialog.component.html',
  styleUrl: './edit-board-dialog.component.css'
})
export class EditBoardDialogComponent {
  formGroup = new FormGroup({
    titleControl: new FormControl('', [Validators.maxLength(20), Validators.pattern("^[a-zA-Z0-9.,?!/ ]*$")]),
    collaboratorsControl: new FormControl('', [Validators.required]),
  })
  
  users: User[] = [];
  collaboratorEmailList: string[] = [];


  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<EditBoardDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: AddBoard,
  ) {
    if (this.data.boardCollaborators !== this.collaboratorEmailList){
      this.getCollaboratorEmails(this.data.boardCollaborators);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getCollaboratorEmails(list: string[]): void {
    if (list === null) return;
    for(let id of list) {
      this.apiService.get<User>(`/user/email/${id}`).subscribe((data) => {
        this.users.push(data);
        this.collaboratorEmailList.push(data.email);
      });
    }
  }

  addCollaborator(): void {
    const email: string = this.formGroup.controls.collaboratorsControl.value ?? '';
    this.apiService.get<number>(`/user/id/${email}`).subscribe((data) => {
      this.collaboratorEmailList.push(email);
    });

    this.formGroup.controls.collaboratorsControl.setValue('');
  }

  removeCollaborator(index: number): void {
    this.collaboratorEmailList.splice(index, 1);
  }

  editBoard(): void {
    if (this.formGroup.controls.titleControl.value === ''){
      this.formGroup.controls.titleControl.setValue(this.data.boardName);
    };

    let addBoardRequest : AddBoardRequest = {
      boardId: this.data.boardId,
      boardCollaborators : this.collaboratorEmailList,
      boardName: this.formGroup.controls.titleControl.value ?? '',
      isPublic: false
    };
    this.dialogRef.close(addBoardRequest);
  }

}
