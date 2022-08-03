import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tweet } from '../model/tweet';
import { UserResponse } from '../model/user-response';
import { LoginService } from '../services/login-service/login.service';
import { TweetService } from '../services/tweet-service/tweet.service';

@Component({
  selector: 'app-get-user',
  templateUrl: './get-user.component.html',
  styleUrls: ['./get-user.component.css'],
})
export class GetUserComponent implements OnInit {
  userResponse: UserResponse = new UserResponse();
  tweets: Tweet[];

  constructor(
    private route: ActivatedRoute,
    private loginservice: LoginService,
    private tweetService: TweetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    let username = routeParams.get('username');
    this.findUser(username);
    this.getTweets(username);
  }

  findUser(username: string) {
    this.loginservice.getUser(username, this.loginservice.getToken()).subscribe(
      (data) => {
        this.userResponse = data;
        console.log(this.userResponse);
      },
      (err) => {
        if (err.error.message.includes('Session')) {
          this.loginservice.logout();
          this.router.navigate(['login']);
        }
      }
    );
  }

  getTweets(username: string) {
    this.tweetService
      .getUserTweet(username, this.loginservice.getToken())
      .subscribe(
        (data) => {
          this.tweets = data;
          console.log(this.tweets);
        },
        (err) => {
          if (err.error.message.includes('Session')) {
            this.loginservice.logout();
            this.router.navigate(['login']);
          }
        }
      );
  }

  //   const today = new Date();
  // const endDate = new Date(startDate.setDate(startDate.getDate() + 7));
  // const days = parseInt((endDate - today) / (1000 * 60 * 60 * 24));
  // const hours = parseInt(Math.abs(endDate - today) / (1000 * 60 * 60) % 24);
  // const minutes = parseInt(Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60) % 60);
  // const seconds = parseInt(Math.abs(endDate.getTime() - today.getTime()) / (1000) % 60);
}
