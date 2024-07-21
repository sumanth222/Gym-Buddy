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

  constructor(private userObjectService: UserServiceService, private userService: UserServiceService) { }

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
        address: cityState,
        role: "na"
    }).then((document) => {
      //Save the user in usercontext for subsequent retrievals
      this.userObject.id = document.id;
      this.userObject.phoneNumber = phoneNumber;
      this.userObject.cityState = cityState;
      this.userObject.username = username;
      this.userObject.role = "na";
      this.userObjectService.setUserObject(this.userObject);
      this.userService.setUserObject(this.userObject);
    });
    }
  }

  async getUser(phoneNumber: string, userObject: UserObject){
    const db = firebase.firestore();
    let user: any = null;
    await db.collection("user-info").where("phoneNumber", "==", phoneNumber).get().then((querySnapshot) => {
      if(querySnapshot.size > 0){
        user = querySnapshot.docs[0];
        userObject.username = user.data().name;
        userObject.phoneNumber = user.data().phoneNumber;
        userObject.cityState = user.data().address;
        userObject.id = user.id;
        userObject.role = user.data().role;
        this.userService.setUserObject(userObject);
      }
    });
    return user;
  }

  async checkIfUserExists(phoneNumber: string){
    const db = firebase.firestore();
    let user: any;

    this.getUser(phoneNumber, new UserObject()).then((user) => {
      console.log(user);
      if(user != null){
        return true;
      }
      return false;
    })
    return null;
  }

  async registerTrainer(id: string, username: string, exp: number, availDay: string, availTime: string, meridian: string, about: string,
    rate: string
  ){
    const db = firebase.firestore();
    let response = null;
    await db.collection("trainer-info").where("id", "==", id).get().then((querySnapshot) => {
      if(querySnapshot.size > 0){
        response = false;
      }
      else{
        addDoc(collection(this.firestore, "trainer-info"), {
          id: id,
          username: username,
          experience: exp,
          availabilityDays: availDay,
          availabilityTime: availTime,
          meridian: meridian,
          bio: about,
          rate: rate
        })
        response = true;
      }
    })
    return response;
  }

  async updateUserAsTrainer(id: string){
    const db = firebase.firestore();

    await db.collection("user-info").doc(id).update({
      role: "trainer"
    }).then(() => {
      console.log("Updated user as Trainer");
    }).catch((err) => {
      console.log("Error while updating user as trainer: "+err);
    })
  }

  async getPendingSessions(){
    const db = firebase.firestore();
    
    await db.collection("sessions").where("status", "==", "Pending").get().then((querySnapshot) => {
      console.log(querySnapshot);
    })
  }
}
