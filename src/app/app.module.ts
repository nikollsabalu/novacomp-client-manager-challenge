import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { MaterialModule } from './shared/material/material.module';
import { ClientFormComponent } from './features/clients/pages/client-form/client-form.component';
import { ClientListComponent } from './features/clients/pages/client-list/client-list.component';
import { SuccessDialogComponent } from './shared/components/success-dialog/success-dialog.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { BirthDatePipe } from './shared/pipes/birthdate.pipe';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { HeaderComponent } from './shared/components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClientFormComponent,
    ClientListComponent,
    SuccessDialogComponent,
    LoadingComponent,
    HeaderComponent,
    FooterComponent,
    BirthDatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }