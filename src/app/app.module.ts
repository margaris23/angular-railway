import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaymentModule } from './payment/payment.module';
import { RailwayService } from './railway.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PaymentModule
  ],
  providers: [RailwayService],
  bootstrap: [AppComponent]
})
export class AppModule { }
