import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  card = this.fb.group({
    cardNumber: [null, Validators.required],
    ownerName: [null, Validators.required]
  });

  constructor(private fb: FormBuilder) {}
}
