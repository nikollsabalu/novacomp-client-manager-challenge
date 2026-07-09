import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BirthDatePipe } from './pipes/birth-date.pipe';
import { SuccessDialogComponent } from './components/success-dialog/success-dialog.component';
import { LoadingComponent } from './components/loading/loading.component';
import { FooterComponent } from './components/footer/footer.component';
import { BirthdatePipe } from './pipes/birthdate.pipe';
import { HeaderComponent } from './components/header/header.component';



@NgModule({
  declarations: [
    NavbarComponent,
    BirthDatePipe,
    SuccessDialogComponent,
    LoadingComponent,
    FooterComponent,
    BirthdatePipe,
    HeaderComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
