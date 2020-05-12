import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  {path: 'payment', component: PaymentComponent},
  {path: '', redirectTo: 'payment', pathMatch: 'prefix'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
