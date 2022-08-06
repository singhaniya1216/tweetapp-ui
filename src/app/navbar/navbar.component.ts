import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login-service/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public isCollapsed = true;
  public loggedIn = false;
  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.loggedIn = this.loginService.isLoggedIn();
    console.log(this.loggedIn);
    console.log(this.loginService.getLoggedUser());
  }

  logoutUser() {
    this.router.navigate(['login']);
    this.loginService.logout();
  }
}
