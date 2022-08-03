import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, NgModel, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtResponse } from '../model/jwt-response';
import { Signin } from '../model/signin';
import { LoginService } from '../services/login-service/login.service';
import Validation from '../services/validation';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  submitted : boolean = false;
  isUsernameExist :boolean = true;

  signin: Signin = new Signin();
  jwt: JwtResponse = new JwtResponse();
  token: any;

  error = false;

  constructor(private formBuilder:FormBuilder, private loginservice: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f() { 
    return this.form.controls; 
  }

  onSubmit() {
    this.submitted=true;
    this.signin=Object.assign({},this.form.value);
    console.log(this.signin);
    if(this.signin.username!='' && this.signin.password!=''){
    this.login();
  }
  }

  login() {
    this.loginservice.login(this.signin).subscribe(
      (data) => {
        console.log(data);
        this.token = data.token;
        this.loginservice.setToken(this.token);
        this.validate(this.token);
      },err => {
        console.log(err.error.message);
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
    console.log("going to home page");
    this.router.navigate(['']);
  }
}
