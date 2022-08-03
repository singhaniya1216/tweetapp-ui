import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tweet } from 'src/app/model/tweet';
import { TweetRequest } from 'src/app/model/tweet-request';

@Injectable({
  providedIn: 'root'
})
export class TweetService {


  url = "http://localhost:8090/api/v1.0/tweets";

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

  likeTweet(username:string, id:string,token:string|any): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.put(`${this.url}/${username}/like/${id}`,{headers});
  }

  replyTweet(username:string, id:string, tweetBody:TweetRequest,token:string|any): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.post(`${this.url}/${username}/reply/${id}`,tweetBody,{headers});
  }

}
