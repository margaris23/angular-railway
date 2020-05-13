import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  form = this.fb.group({
    cardNumber: [null, Validators.required],
    ownerName: [null, Validators.required]
  });

  result: any;

  constructor(private fb: FormBuilder, private service: PaymentService) {}

  async submit() {
   this.result = await this.service.save(this.form.value);
  }
}
