import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tweet } from '../model/tweet';
import { TweetRequest } from '../model/tweet-request';
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

  viewUser: string;
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
  addTagEditClicked: boolean = false;
  tweetRequest: TweetRequest = new TweetRequest();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private tweetService: TweetService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (!this.loginService.isLoggedIn()) {
      this.router.navigateByUrl('login');
    }

    this.replyTweetForm = this.formBuilder.group({
      replyTweetBody: ['', [Validators.required, Validators.maxLength(144)]],
      replyTweetTag: ['', Validators.maxLength(50)],
    });

    this.editTweetForm = this.formBuilder.group({
      editTweetBody: ['', [Validators.required, Validators.maxLength(144)]],
      editTweetTag: ['', Validators.maxLength(50)],
    });

    this.loggedToken = this.loginService.getToken();
    this.loggedUser = this.loginService.getLoggedUser();

    const routeParams = this.route.snapshot.paramMap;
    let username = routeParams.get('username');
    this.viewUser = routeParams.get('username');
    this.findUser(username);
    this.getTweets(username);
  }

  findUser(username: string) {
    if (null != username) {
      this.loginService
        .getUser(username, this.loginService.getToken())
        .subscribe(
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
      this.tweetService
        .getUserTweet(username, this.loginService.getToken())
        .subscribe(
          (data) => {
            this.tweetList = data;
            this.tweetList = this.tweetList.sort((a, b) => new Date(b.createdDateTime).getTime() - new Date(a.createdDateTime).getTime());
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
    this.tweetService.getUserTweet(this.viewUser, this.loggedToken).subscribe(
      (data: any) => {
        this.tweetList.push(...data);
        this.tweetList = this.tweetList.sort((a, b) => new Date(b.createdDateTime).getTime() - new Date(a.createdDateTime).getTime());
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
}
