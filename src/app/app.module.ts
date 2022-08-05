import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, NgForm, NgModel, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RegistrationComponent } from './registration/registration.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { GetUserComponent } from './get-user/get-user.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { SetSizePipe } from './pipes/set-size.pipe';
import { LikedByPipePipe } from './pipes/liked-by-pipe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    RegistrationComponent,
    PasswordResetComponent,
    AllUsersComponent,
    GetUserComponent,
    DateAgoPipe,
    SetSizePipe,
    LikedByPipePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
