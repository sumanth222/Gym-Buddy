import { Injectable } from '@angular/core';
import { UserObject } from 'src/app/objects/user-object';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  userObject: UserObject = new UserObject();

  constructor() { }

  setUserObject(userObject: UserObject){
    this.userObject = userObject;
  }

  getUserObject(){
    return this.userObject;
  }
}
