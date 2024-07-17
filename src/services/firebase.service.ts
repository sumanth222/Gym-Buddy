import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { Firestore, addDoc, collection, getDocs, getFirestore, query } from 'firebase/firestore';
import { firebaseConfig } from '../environments/environment';
import "firebase/compat/firestore";
import { UserObject } from 'src/app/objects/user-object';
import { UserServiceService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  app = firebase.initializeApp(firebaseConfig);
  firestore = getFirestore(this.app)
  docId: string = "";
  userExists: boolean = false;
  userObject: UserObject = new UserObject;

  constructor(private userObjectService: UserServiceService) { }

  async createUserInfo(username: string, phoneNumber: string, cityState: string){
    const db = firebase.firestore();

    await db.collection("user-info").where("phoneNumber", "==", phoneNumber).get().then((querySnapshot) => {
      if(querySnapshot.size > 0){
        this.userExists= true
      }
    });

    if(!this.userExists){
      console.log("New user, registering.")
      addDoc(collection(this.firestore, 'user-info'), {
        name: username,
        phoneNumber:  phoneNumber,
        createdDate: new Date(),
        lastLogin: new Date(),
        address: cityState
    }).then((document) => {
      //Save the user in usercontext for subsequent retrievals
      this.userObject.id = document.id;
      this.userObject.phoneNumber = phoneNumber;
      this.userObject.cityState = cityState;
      this.userObject.username = username;
      this.userObjectService.setUserObject(this.userObject);
    });
    }
  }

  async getUser(phoneNumber: string){
    const db = firebase.firestore();
    let user: any = null;
    console.log("Phno: "+phoneNumber);
    await db.collection("user-info").where("phoneNumber", "==", phoneNumber).get().then((querySnapshot) => {
      if(querySnapshot.size > 0){
        user = querySnapshot.docs[0];
      }
    });
    return user;
  }

  async checkIfUserExists(phoneNumber: string){
    const db = firebase.firestore();
    let user: any;

    console.log("PhNo:"+ phoneNumber)

    this.getUser(phoneNumber).then((user) => {
      console.log(user);
      if(user != null){
        return true;
      }
      return false;
    })
    return null;
  }

  async registerTrainer(id: string, username: string, exp: number, availDay: string, availTime: string, meridian: string, about: string){


  }
}
