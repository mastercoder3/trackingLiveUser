import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AgmCoreModule} from '@agm/core';
import { FilterPipeModule } from 'ngx-filter-pipe';

// FireBase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';


// Material Imports
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSnackBarModule} from '@angular/material/snack-bar';


import { AppComponent } from './app.component';
import { LandingComponent } from './dashboard/landing/landing.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CreateNewComponent } from './dashboard/create-new/create-new.component';
import { LoginComponent } from './entry/login/login.component';
import { SignupComponent } from './entry/signup/signup.component';
import { CreateDialogComponent } from './dashboard/create-dialog/create-dialog.component';
import { SpinnerComponent } from './ui/spinner/spinner.component';
import { OrdersComponent } from './dashboard/orders/orders.component';
import { TrackingComponent } from './dashboard/tracking/tracking.component';
import { FooterComponent } from './shared/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    NavbarComponent,
    CreateNewComponent,
    LoginComponent,
    SignupComponent,
    CreateDialogComponent,
    SpinnerComponent,
    OrdersComponent,
    TrackingComponent,
    FooterComponent
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule,
    MatGridListModule,
    MatSnackBarModule,
    FormsModule,
    FilterPipeModule,
    ReactiveFormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB6Mp7CXGfGt5peVHdZaSw8MR7L1BlXKNs',
      libraries: ["places"]
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    RouterModule.forRoot([
    {path: '', component: LandingComponent},
    {path: 'signin', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'create-new', component: CreateNewComponent},
    {path: 'orders', component: OrdersComponent},
    {path: 'tracking', component: TrackingComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [CreateDialogComponent]
})
export class AppModule { }
