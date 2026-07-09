import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { take } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

   ngOnInit(): void {
    this.authService.user$
      .pipe(take(1))
      .subscribe(user => {
        if (user) {
          this.router.navigate(['/clients'], { replaceUrl: true });
        }
      });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { email, password } = this.loginForm.getRawValue();

      await this.authService.login(email!, password!);

      this.router.navigate(['/clients']);
    } catch (error) {
      console.error(error);
      this.errorMessage = 'Correo o contraseña incorrectos.';
    } finally {
      this.isLoading = false;
    }
  }
}