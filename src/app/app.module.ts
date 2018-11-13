import {RouterModule, Routes} from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { MatSliderModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DrawComponent } from './draw/draw.component';
import { TowerComponent } from './tower/tower.component';

const appRoutes = [
  {path: 'tower', component: TowerComponent},
  {path: 'draw', component: DrawComponent},
  {path: '',  component: DrawComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    DrawComponent,
    TowerComponent
  ],
  imports: [ BrowserModule, FormsModule, BrowserAnimationsModule, MatSliderModule
  , RouterModule.forRoot(appRoutes, {enableTracing: false}) ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
