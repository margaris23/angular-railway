import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { CustomError, HandlerReply } from '../railway.model';
import { PaymentFormModel } from './payment-form.model';
import { PaymentService, ServerReply, ServiceError } from './payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  form = this.fb.group({
    cardNumber: [null, Validators.required],
    ownerName: [null, Validators.required],
    amount: [null, Validators.required]
  });

  result: HandlerReply<ServerReply | ServiceError>;

  CustomError = CustomError;

  constructor(private fb: FormBuilder, private service: PaymentService) {}

  save() {
   this.result = this.service.save(this.form.value as PaymentFormModel);
  }
}
