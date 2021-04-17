import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { AppComponent } from './app.component';
import { AngularOpenlayersModule } from 'ngx-openlayers';
import { OsmViewComponent } from './osm-view/osm-view.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateModifyHotspotComponent } from './create-modify-hotspot/create-modify-hotspot.component';

@NgModule({
  imports:      [ BrowserModule, ReactiveFormsModule, AngularOpenlayersModule, HttpClientModule, NgbModule, BrowserAnimationsModule, MatSidenavModule, MatButtonModule, MatToolbarModule, MatInputModule,
    MatFormFieldModule, MatSelectModule, MatAutocompleteModule],
  declarations: [ AppComponent, OsmViewComponent, CreateModifyHotspotComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
