import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from '../model/user-response';
import { LoginService } from '../services/login-service/login.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {
  userResponses:UserResponse[];

  constructor(private loginservice: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.loginservice.getAllUsers(this.loginservice.getToken()).subscribe(
      (data)=>{
        this.userResponses=data;
        console.log(this.userResponses);
      },
      err=>{
        if(err.error.message.includes("Session")){
        this.loginservice.logout();
        this.router.navigate(['login']);
        }
      }
    )
  }

}
