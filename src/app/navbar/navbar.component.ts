import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login-service/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public isCollapsed = true;
  public loggedIn = false;
  constructor(private loginService:LoginService) { }

  ngOnInit(): void {
    this.loggedIn = this.loginService.isLoggedIn();
    console.log(this.loggedIn);
    console.log(this.loginService.getLoggedUser());
    console.log(this.loginService.getToken());
  }

  logoutUser(){
    this.loginService.logout();
    location.reload();
  }

}
