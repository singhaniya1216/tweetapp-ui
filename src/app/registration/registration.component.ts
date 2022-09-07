import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { LoginService } from '../services/login-service/login.service';
import Validation from '../services/validation';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  form: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    contactNumber: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  showPassword : boolean = false;
  showConfirmPassword : boolean = false;

  submitted = false;
  loading = false;
  isEmailUnique = true;
  isUsernameUnique :boolean = true;
  success = false;
  user: User;
  
  constructor(private formBuilder: FormBuilder,private router:Router,private loginService: LoginService) {
   }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email:['', [Validators.email,Validators.required]],
      contactNumber:['',[Validators.required, Validators.pattern('[6-9]{1}[0-9]{9}')]],
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

  onSubmit(){
   this.submitted = true;
   if(this.form.valid){
     console.log(this.form.value);
     this.user=Object.assign({},this.form.value);
     console.log(this.user);
     this.loading = true;
     this.loginService.registerUser(this.user).subscribe(
       data=>{
        console.log(data);
        if (data.username !== undefined) {
          this.success = true;
          alert('Registration Successful!!!\nRedirecting to login page...');
          this.router.navigate(['/login']);
      }
       },
       err=>{
        this.loading = false;
        if(err.error.message.includes('Username already')){
          console.log(err.error.message)
          this.isUsernameUnique=false;
        }
        if(err.error.message.includes('Email already')){
          console.log(err.error.message)
          this.isEmailUnique=false;
        }

       }
     )
   }
 }

 onReset(): void {
  this.submitted = false;
  this.form.reset();
}

}
