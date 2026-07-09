import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.scss']
})
export class SuccessDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<SuccessDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close(true);
  }

}