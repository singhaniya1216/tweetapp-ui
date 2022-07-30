import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { Signin } from 'src/app/model/signin';
import { UserResponse } from 'src/app/model/user-response';
import { JwtResponse } from 'src/app/model/jwt-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url = "http://localhost:8090/api/v1.0/tweets"

  constructor(private http:HttpClient) { }

  getUser(username: string | any): Observable<any>{
    return this.http.get(`${this.url}/user/search/${username}`);
  }


  forgotPassword(password: string | any, username:string | any): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("password",password);
    return this.http.get(`${this.url}/${username}/forgot`,{params:queryParams});

  }


  getAllUsers():Observable<any>{
    return this.http.get(`${this.url}/users/all`);
  }


  registerUser(saveUser: User):Observable<any>{
    return this.http.post(`${this.url}/register`, saveUser);
  }


  login(credentials:Signin):Observable<any>{
    return this.http.post(`${this.url}/login`, credentials)
  }


  validateUser(token: string):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get(`${this.url}/validate`, {headers});
  }


  setToken(token: string){
    localStorage.setItem("token",token)
  }

  setLoggedUser(username: string){
    localStorage.setItem("username", username)
  }

  getLoggedUser(){
    return localStorage.getItem("username")
  }

  removeLoggedUser(){
    localStorage.removeItem("username")
  }

  isLoggedIn(){
    let token = localStorage.getItem("token");
    if(token == undefined || token == '' || token == null){
      return false;
    }
    else{
      return true;
    }
  }

  logout(){
    localStorage.removeItem("token");
    this.removeLoggedUser();
    return true;
  }

  getToken(){
    return localStorage.getItem("token");
  }
}
