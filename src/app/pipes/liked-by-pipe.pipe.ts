import { Pipe, PipeTransform } from '@angular/core';
import { LoginService } from '../services/login-service/login.service';

@Pipe({
  name: 'likedByPipe'
})
export class LikedByPipePipe implements PipeTransform {

  constructor(private login: LoginService){}
  transform(value: any, ...args: any[]): any {
    if(value.includes(this.login.getLoggedUser())){
    return true;
    }
    else{
      return false;
    }
  }

}
