import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
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

  notFutureDateValidator = (control: AbstractControl) => {
    if (!control.value) return null;

    const selectedDate = this.createLocalDate(control.value);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return selectedDate > today ? { futureDate: true } : null;
  };

  clientForm = this.fb.group({
    firstName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]
    ],
    lastName: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]
    ],
    birthDate: ['', [Validators.required, this.notFutureDateValidator]],
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
        birthDate: this.createLocalDate(value.birthDate!),
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

  private createLocalDate(date: string): Date {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}