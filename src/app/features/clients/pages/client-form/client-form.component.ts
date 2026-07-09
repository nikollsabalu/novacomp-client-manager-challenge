import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SuccessDialogComponent } from 'src/app/shared/components/success-dialog/success-dialog.component';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  clientForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    birthDate: ['', Validators.required],
    age: [{ value: null as number | null, disabled: true }, [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private dialog: MatDialog,
    private router: Router
  ) { }


  isLoading = false;

  ngOnInit(): void {
    this.clientForm.get('birthDate')?.valueChanges.subscribe((birthDate) => {
      const age = this.calculateAge(birthDate);

      this.clientForm.get('age')?.setValue(age);
    });
  }

  async onSubmit(): Promise<void> {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    try {
      const value = this.clientForm.getRawValue();

      await this.clientService.addClient({
        firstName: value.firstName!,
        lastName: value.lastName!,
        birthDate: new Date(value.birthDate!),
        age: Number(value.age)
      });

      this.clientForm.reset();

      const dialogRef = this.dialog.open(SuccessDialogComponent, {
        width: '400px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe((result) => {

        if (result) {
          this.router.navigate(['/clients']);
        }

      });

    } catch (error) {
      console.error('Error al guardar cliente:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private calculateAge(birthDate: string | null): number | null {
    if (!birthDate) return null;

    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }
}