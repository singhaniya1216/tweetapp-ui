export class Tweet {
    id:string;
    tweetMessage:string;
    createdBy:string;
    createdDateTime:Date;
    repliedToTweet:Tweet[];
    tag:string;
    likedBy:string[];
}
