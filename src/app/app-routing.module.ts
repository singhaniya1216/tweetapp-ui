import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTweetComponent } from './all-tweet/all-tweet.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { GetUserComponent } from './get-user/get-user.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthGuard } from './services/auth-service/auth.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponent, pathMatch: 'full'},
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'register', component: RegistrationComponent, pathMatch: 'full'},
  {path: 'reset',component: PasswordResetComponent,pathMatch: 'full',canActivate:[AuthGuard]},
  {path: 'allUsers',component: AllUsersComponent,pathMatch: 'full',canActivate:[AuthGuard]},
  {path: 'user/:username',component: GetUserComponent,pathMatch: 'full',canActivate:[AuthGuard]},
  {path: 'allTweets',component: AllTweetComponent,pathMatch: 'full',canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
