import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tweet } from '../model/tweet';
import { LoginService } from '../services/login-service/login.service';
import { TweetService } from '../services/tweet-service/tweet.service';
import { MatDialog } from '@angular/material/dialog';
import { TweetRequest } from '../model/tweet-request';
import { UserResponse } from '../model/user-response';
import * as $ from 'jQuery';
import * as bootstrap from 'bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userResponse: UserResponse = new UserResponse();

  tweetForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  editSubmitted: boolean = false;
  replySubmitted: boolean = false;
  loggedUser: string;
  loggedToken: string;
  tweetList: Tweet[] = [];
  replyTweetForm: FormGroup;
  editTweetForm: FormGroup;
  currentTweet: Tweet = new Tweet();
  addTagClicked: boolean = false;
  addTagEditClicked: boolean = false;
  tweetRequest: TweetRequest = new TweetRequest();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private tweetService: TweetService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loggedToken = this.loginService.getToken();
    this.loggedUser = this.loginService.getLoggedUser();

    if (!this.loginService.isLoggedIn()) {
      this.router.navigateByUrl('login');
    }

    this.tweetForm = this.formBuilder.group({
      tweetBody: ['', [Validators.required, Validators.maxLength(144)]],
      tweetTag: ['', Validators.maxLength(50)],
    });

    this.replyTweetForm = this.formBuilder.group({
      replyTweetBody: ['', [Validators.required, Validators.maxLength(144)]],
      replyTweetTag: ['', Validators.maxLength(50)],
    });

    this.editTweetForm = this.formBuilder.group({
      editTweetBody: ['', [Validators.required, Validators.maxLength(144)]],
      editTweetTag: ['', Validators.maxLength(50)],
    });
    this.findUser(this.loggedUser);
    this.getTweets(this.loggedUser);
  }

  findUser(username: string) {
    if (null != username) {
      this.loginService.getUser(username, this.loggedToken).subscribe(
        (data) => {
          this.userResponse = data;
          console.log(this.userResponse);
        },
        (err) => {
          if (err.error.message.includes('Session')) {
            this.loginService.logout();
            alert('Session time out!!!\nPlease login again...');
            this.router.navigate(['login']);
          }
        }
      );
    }
  }

  getTweets(username: string) {
    if (null != username) {
      this.tweetService.getUserTweet(username, this.loggedToken).subscribe(
        (data) => {
          this.tweetList = data;
          console.log(this.tweetList);
        },
        (err) => {
          if (err.error.message.includes('Session')) {
            this.loginService.logout();
            alert('Session time out!!!\nPlease login again...');
            this.router.navigate(['login']);
          }
        }
      );
    }
  }

  postTweet() {
    this.submitted = true;
    this.loading = true;
    this.tweetRequest = {
      tweetMessage: this.f['tweetBody'].value,
      tag: this.f['tweetTag'].value,
    };
    this.tweetService
      .postTweet(this.loggedUser, this.tweetRequest, this.loggedToken)
      .subscribe(
        (data: any) => {
          if (data.id !== undefined) {
            this.refreshTweets();
            console.log(this.tweetList);
            this.addTagClicked = false;
            this.resetForm(this.tweetForm);
          }
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          if (err.error.message.includes('Session')) {
            this.loginService.logout();
            alert('Session time out!!!\nPlease login again...');
            this.router.navigate(['login']);
          }
        }
      );

    console.log('x');
  }

  likeTweet(tweetId: string) {
    this.tweetService
      .likeTweet(this.loggedUser, tweetId, this.loggedToken.toString())
      .subscribe(
        (data: any) => {
          this.refreshTweets();
        },
        (err) => {
          if (err.error.message.includes('Session')) {
            this.loginService.logout();
            alert('Session time out!!!\nPlease login again...');
            this.router.navigate(['login']);
          }
        }
      );
  }

  deleteTweet(tweetId: string) {
    this.tweetService
      .deleteTweet(this.loggedUser, tweetId, this.loggedToken)
      .subscribe(
        (data: any) => {
          this.refreshTweets();
        },
        (err) => {
          if (err.error.message.includes('Session')) {
            this.loginService.logout();
            alert('Session time out!!!\nPlease login again...');
            this.router.navigate(['login']);
          }
        }
      );
  }

  openEditTweetPopup(content: any, tweet: Tweet) {
    this.currentTweet = tweet;
    this.tweetRequest.tweetMessage = this.currentTweet.tweetMessage;
    this.tweetRequest.tag = this.currentTweet.tag;
    if (this.tweetRequest.tag.length > 0) {
      this.addTagEditClicked = true;
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
  editTweetSubmit() {
    this.editSubmitted = true;
    this.tweetRequest.tweetMessage =
      this.editTweetForm.controls['editTweetBody'].value;
    this.tweetRequest.tag = this.editTweetForm.controls['editTweetTag'].value;
    this.tweetService
      .updateTweet(
        this.loggedUser,
        this.currentTweet.id,
        this.tweetRequest,
        this.loggedToken
      )
      .subscribe(
        (data: any) => {
          this.refreshTweets();
          this.currentTweet = new Tweet();
          this.tweetRequest = new Tweet();
          this.modalService.dismissAll();
          this.resetForm(this.editTweetForm);
        },
        (err) => {
          if (err.error.message.includes('Session')) {
            this.loginService.logout();
            alert('Session time out!!!\nPlease login again...');
            this.router.navigate(['login']);
          }
        }
      );
  }

  openReplyTweetPopup(content: any, tweet: Tweet) {
    this.currentTweet = tweet;
    this.addTagEditClicked = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
  replyTweetSubmit() {
    this.replySubmitted = true;
    this.tweetRequest = {
      tweetMessage: this.replyTweetForm.controls['replyTweetBody'].value,
      tag: this.replyTweetForm.controls['replyTweetTag'].value,
    };
    this.tweetService
      .replyTweet(
        this.loggedUser,
        this.currentTweet.id,
        this.tweetRequest,
        this.loggedToken
      )
      .subscribe(
        (data: any) => {
          this.refreshTweets();
          this.currentTweet = new Tweet();
          this.tweetRequest = new Tweet();
          this.modalService.dismissAll();
          this.resetForm(this.replyTweetForm);
        },
        (err) => {
          if (err.error.message.includes('Session')) {
            this.loginService.logout();
            alert('Session time out!!!\nPlease login again...');
            this.router.navigate(['login']);
          }
        }
      );
  }

  refreshTweets() {
    this.tweetList.splice(0);
    this.tweetService.getUserTweet(this.loggedUser, this.loggedToken).subscribe(
      (data: any) => {
        this.tweetList.push(...data);
      },
      (err) => {
        if (err.error.message.includes('Session')) {
          this.loginService.logout();
          alert('Session time out!!!\nPlease login again...');
          this.router.navigate(['login']);
        }
      }
    );
    console.log(this.tweetList);
  }

  addTagEdit() {
    this.addTagEditClicked = true;
  }
  removeTagEdit() {
    this.addTagEditClicked = false;
  }
  addTag() {
    this.addTagClicked = true;
  }
  removeTag() {
    this.addTagClicked = false;
  }

  resetForm(form: FormGroup) {
    form.reset();
    Object.keys(form.controls).forEach((key) => {
      form.get(key).setErrors(null);
    });
  }

  closeModal() {
    this.modalService.dismissAll();
    this.tweetRequest = new TweetRequest();
  }

  trackTweet(index: number, tweet: Tweet) {
    return tweet.id;
  }

  get f() {
    return this.tweetForm.controls;
  }
}
