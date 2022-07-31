import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtResponse } from '../model/jwt-response';
import { Signin } from '../model/signin';
import { LoginService } from '../services/login-service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  signin: Signin = new Signin();
  jwt: JwtResponse = new JwtResponse();
  token: any;

  error = false;

  constructor(private loginservice: LoginService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(form: any) {
    this.signin.username = form.userid;
    this.signin.password = form.password;
    console.log(this.signin);
    this.login();
  }

  login() {
    this.loginservice.login(this.signin).subscribe(
      (data) => {
        console.log(data);
        this.token = data.token;
        this.loginservice.setToken(this.token);
        this.validate(this.token);
      },error => {
        this.error = true;
      }
    );
  }

  validate(token: String) {
    this.loginservice.validateUser(this.token).subscribe(
      (data) => {
        console.log(data);
        this.jwt.username = data.username;
        this.jwt.valid = data.valid;
        this.loginservice.setLoggedUser(this.jwt.username);
        console.log(this.jwt);
        if (this.jwt.valid) {
          this.gotoHomePage();
        }
      }
    );
  }

  gotoHomePage() {
    this.router.navigate(['']);
  }
}
