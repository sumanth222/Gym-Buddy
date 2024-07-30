import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { Firestore, Timestamp, addDoc, collection, getDocs, getFirestore, query } from 'firebase/firestore';
import { firebaseConfig } from '../environments/environment';
import "firebase/compat/firestore";
import { UserObject } from 'src/app/objects/user-object';
import { SessionObject } from 'src/app/objects/session-object';
import { UserServiceService } from './user-service.service';
import { TrainerObject } from 'src/app/objects/trainer-object';
import { TrainerInfoService } from './trainer-info.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  app = firebase.initializeApp(firebaseConfig);
  firestore = getFirestore(this.app)
  docId: string = "";
  userExists: boolean = false;
  userObject: UserObject = new UserObject;

  constructor(private userObjectService: UserServiceService, private userService: UserServiceService,
    private trainerObjService: TrainerInfoService
  ) { }

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
    await db.collection("user-info").where("phoneNumber", "==", phoneNumber).get().then(async (querySnapshot) => {
      let docId = querySnapshot.docs
      if(querySnapshot.size > 0){
        user = querySnapshot.docs[0];
        userObject.username = user.data().name;
        userObject.phoneNumber = user.data().phoneNumber;
        userObject.cityState = user.data().address;
        userObject.id = user.id;
        userObject.role = user.data().role;
        this.userService.setUserObject(userObject);

        if(userObject.role == "trainer"){
          //Get and update user session as trainer
          let trainerObject = new TrainerObject();

          await db.collection("trainer-info").where("id" , "==", user.id).get().then((querySnapshot) => {
            let trainerObj = querySnapshot.docs[0];
            trainerObject.id = trainerObj.data().id;
            trainerObject.availdays = trainerObj.data().availabilityDays;
            trainerObject.availtime = trainerObj.data().availabilityTime;
            trainerObject.bio = trainerObj.data().bio;
            trainerObject.exp = trainerObj.data().experience;
            trainerObject.meridian = trainerObj.data().meridian;
            trainerObject.rate = trainerObj.data().rate;
            this.trainerObjService.setTrainerObj(trainerObject);
          })
        }
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
    let trainerObj = new TrainerObject();
    trainerObj.availdays = availDay;
    trainerObj.availtime = availTime;
    trainerObj.bio = about;
    trainerObj.username = username;
    trainerObj.meridian = meridian;
    trainerObj.rate = rate;
    this.trainerObjService.setTrainerObj(trainerObj);
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

  async getSessions(status: string){
    const db = firebase.firestore();
    let pendingSessions: SessionObject[] = [];
    
    await db.collection("sessions").where("Status", "==", status).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        pendingSessions.push(new SessionObject(
          doc.id,
          doc?.data()?.UserInfoID,
          doc?.data()?.Username,
          doc?.data()?.TrainerID,
          doc?.data()?.Status,
          doc?.data()?.RequestedDate,
          doc?.data()?.Feedback,
          doc?.data()?.CreatedDate,
          doc?.data()?.Description,
          doc?.data()?.Hours,
          doc?.data()?.Gymname,
          doc?.data()?.Locality,
          doc?.data()?.Landmark,
          doc?.data()?.State,
          doc?.data()?.Pincode,
          doc?.data()?.StartTime,
          doc?.data()?.EndTime,
        ));
      })
    })
    return pendingSessions;
  }

  async getSessionById(id: string){
    const db = firebase.firestore();
    let session: any;
    
    await db.collection("sessions").doc(id).get().then((doc) => {
        session = new SessionObject(
          doc.id,
          doc?.data()?.UserInfoID,
          doc?.data()?.Username,
          doc?.data()?.TrainerID,
          doc?.data()?.Status,
          doc?.data()?.RequestedDate,
          doc?.data()?.Feedback,
          doc?.data()?.CreatedDate,
          doc?.data()?.Description,
          doc?.data()?.Hours,
          doc?.data()?.Gymname,
          doc?.data()?.Locality,
          doc?.data()?.Landmark,
          doc?.data()?.State,
          doc?.data()?.Pincode,
          doc?.data()?.StartTime,
          doc?.data()?.EndTime,
        );
      })
    return session;
  }

  async confirmSession(docID: string, trainerId: string){
    const db = firebase.firestore();

    await db.collection("sessions").doc(docID).update({
      Status : "Confirmed",
      trainer_id: trainerId
    }).then((response) => {
    }).catch((error) => {
      console.log("Error occurred while updating session as confirmed: "+error);
    })
  }

  async startSession(docID: string){
    const db = firebase.firestore();

    await db.collection("sessions").doc(docID).update({
      status : "Started",
    }).then((response) => {
    }).catch((error) => {
      console.log("Error occurred while updating session as started: "+error);
    })
  }
  
  async cancelSession(docID: string){
    const db = firebase.firestore();

    await db.collection("sessions").doc(docID).update({
      Status : "Pending",
      trainer_id: ""
    }).then((response) => {
    }).catch((error) => {
      console.log("Error occurred while updating session as started: "+error);
    })
  }

  async createSession(userId: string, username: string, reqDate: string, startTime: string, endTime: string,
    landmark: string, expIndex: number, desc: string, gymname: string, locality: string, pincode: string, state: string,
    hours: string
  ){
    const db = firebase.firestore();

    await addDoc(collection(this.firestore, "sessions"), {
        UserInfoID: userId,
        Username: username,
        TrainerID: "",
        CreatedDate: new Date().toDateString(),
        RequestedDate: reqDate,
        StartTime: startTime,
        EndTime: endTime,
        Gymname: gymname,
        Locality: locality,
        Pincode: pincode,
        Landmark: landmark,
        State: state,
        ExpIndex: expIndex,
        Description: desc,
        Status: "Pending",
        Feedback: "",
        Hours: hours
    })
  }
}
