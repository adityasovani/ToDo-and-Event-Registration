import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { AdminComponent } from './admin/admin.component';


const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'about', component: RegisterComponent },
  { path: 'sponsors', component: RegisterComponent },
  { path: 'confirm/:id', component: ConfirmComponent },
  {
    path: 'dashboard', component: AdminComponent, children: [
      { path: 'viewAll', component: AdminComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
