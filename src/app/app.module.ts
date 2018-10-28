import { BrowserModule } from '@angular/platform-browser';
import { MatSliderModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DrawComponent } from './draw/draw.component';

@NgModule({
  declarations: [
    AppComponent,
    DrawComponent
  ],
  imports: [ BrowserModule, FormsModule, BrowserAnimationsModule, MatSliderModule ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
