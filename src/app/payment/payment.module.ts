import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PaymentComponent } from './payment.component';
import { PaymentService } from './payment.service';

@NgModule({
  declarations: [PaymentComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [PaymentComponent],
  providers: [PaymentService]
})
export class PaymentModule { }
