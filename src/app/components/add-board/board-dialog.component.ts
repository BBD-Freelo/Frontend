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
import { Regex } from '../../enums/regex';

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
    titleControl: new FormControl('', [Validators.maxLength(9), Validators.pattern("^[a-zA-Z0-9.,?!/ ]*$")]),
    privacyControl: new FormControl('', [Validators.required]),
    collaboratorsControl: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50), Validators.pattern(Regex.Email)]),
  })
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

  addCollaborator(): void {
    if (this.formGroup.controls.collaboratorsControl.invalid) return;
    const email: string = this.formGroup.controls.collaboratorsControl.value ?? '';
    try {
      this.apiService.get<number>(`/user/id/${email}`).subscribe((data) => {
        this.collaboratorEmailList.push(email);
      });
    } catch (error: any) {
      if (error.status === 404){
        this.formGroup.controls.collaboratorsControl.setErrors({
          notFound: true
        });
      }
    }
    this.formGroup.controls.collaboratorsControl.setValue('');
  }

  removeCollaborator(index: number): void {
    this.collaboratorEmailList.splice(index, 1);
  }

  createBoard(): void {
    if (this.formGroup.controls.titleControl.invalid) return;

    const privacyBoolean: boolean = this.formGroup.controls.privacyControl.value === '' ? false : true;

    let addBoardRequest : AddBoardRequest = {
      boardCollaborators : this.collaboratorEmailList,
      boardName: this.formGroup.controls.titleControl.value ?? '',
      isPublic: privacyBoolean,
      isOwner: true
    };

    this.dialogRef.close(addBoardRequest);
  }

}
