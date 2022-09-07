import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Signin } from '../model/signin';
import { User } from '../model/user';
import { LoginService } from '../services/login-service/login.service';
import Validation from '../services/validation';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  submitted : boolean = false;
  isUsernameExist :boolean = true;
  user: Signin;
  showPassword : boolean = false;
  showConfirmPassword : boolean = false;
  
  constructor(private formBuilder: FormBuilder,private router:Router,private loginService: LoginService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword:['',Validators.required],
    }
    ,{     
      validators:[Validation.match('password', 'confirmPassword')]
    });
  }

  passwordShow(){
    this.showPassword = !this.showPassword;
  }

  confirmPasswordShow(){
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  
  get f() { 
    return this.form.controls; 
  }

  onSubmit() {
    this.submitted=true;
    this.isUsernameExist=true;
    if(this.form.valid){
    console.log(this.form.value)
    this.user=Object.assign({},this.form.value);
    this.loginService.forgotPassword(this.user.password,this.user.username).subscribe(
      response => {
        console.log(response);
        alert("Password reset successful.");
        this.router.navigate(['/login']);
      },
      err => {
        if(err.error.message.includes('User does not exist')){
          console.log(err.error.message)
          this.isUsernameExist=false;
        }
      }
    );
  }
  }
  resetDaa(resetDaa: any) {
    throw new Error('Method not implemented.');
  }

}
