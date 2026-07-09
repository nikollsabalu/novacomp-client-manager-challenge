import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './features/clients/pages/client-list/client-list.component';
import { ClientFormComponent } from './features/clients/pages/client-form/client-form.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'clients',
    pathMatch: 'full'
  },
  {
    path: 'clients',
    component: ClientListComponent
  },
  {
    path: 'clients/new',
    component: ClientFormComponent
  },
  {
    path: '**',
    redirectTo: 'clients'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
