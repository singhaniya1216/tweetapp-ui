import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tweet } from 'src/app/model/tweet';
import { TweetRequest } from 'src/app/model/tweet-request';

@Injectable({
  providedIn: 'root'
})
export class TweetService {


  url = "http://13.233.48.9/api/v1.0/tweets";

  constructor(private http:HttpClient) { }

  getAllTweet(token:string|any): Observable<Tweet[]>{
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get<Tweet[]>(`${this.url}/all`,{headers});
  }

  getUserTweet(username:string,token:string|any): Observable<Tweet[]>{
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get<Tweet[]>(`${this.url}/${username}`,{headers});
  }

  postTweet(username:string, tweetBody:TweetRequest,token:string|any): Observable<Tweet>{
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.post<Tweet>(`${this.url}/${username}/add`,tweetBody,{headers});
  }

  updateTweet(username:string, id:string, tweetBody:TweetRequest,token:string|any): Observable<Tweet>{
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.put<Tweet>(`${this.url}/${username}/update/${id}`,tweetBody,{headers});
  }

  deleteTweet(username:string, id:string,token:string|any): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.delete(`${this.url}/${username}/delete/${id}`,{headers});
  }

  likeTweet(username:string|any, id:string|any,token:string|any): Observable<HttpStatusCode>{
    let headers = new HttpHeaders().set('Authorization', token);
    return this.http.put<HttpStatusCode>(`${this.url}/${username}/like/${id}`,null,{headers:headers});
  }

  replyTweet(username:string, id:string, tweetBody:TweetRequest,token:string|any): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.post(`${this.url}/${username}/reply/${id}`,tweetBody,{headers});
  }

}
