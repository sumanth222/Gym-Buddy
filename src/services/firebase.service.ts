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
    
    await db.collection("sessions").where("status", "==", status).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let timestamp = new Timestamp(doc.data().requested_date.seconds, doc.data().requested_date.nanoseconds);
        let created_date = new Timestamp(doc.data().created_date.seconds, doc.data().created_date.nanoseconds);
        pendingSessions.push(new SessionObject(
          doc.id,
          doc.data().user_id,
          doc.data().trainer_id,
          doc.data().status,
          timestamp.toDate(),
          doc.data().requested_time,
          doc.data().location,
          doc.data().feedback,
          created_date.toDate(),
          doc.data().description,
          doc.data().hours
        ));
      })
    })
    return pendingSessions;
  }

  async getSessionById(id: string){
    const db = firebase.firestore();
    let session: any;
    
    await db.collection("sessions").doc(id).get().then((doc) => {
        let timestamp = new Timestamp(doc?.data()?.requested_date.seconds, doc?.data()?.requested_date.nanoseconds);
        let created_date = new Timestamp(doc?.data()?.created_date.seconds, doc?.data()?.created_date.nanoseconds);
        session = new SessionObject(
          doc.id,
          doc?.data()?.user_id,
          doc?.data()?.trainer_id,
          doc?.data()?.status,
          timestamp.toDate(),
          doc?.data()?.requested_time,
          doc?.data()?.location,
          doc?.data()?.feedback,
          created_date.toDate(),
          doc?.data()?.description,
          doc?.data()?.hours
        );
      })
    return session;
  }

  async confirmSession(docID: string, trainerId: string){
    const db = firebase.firestore();

    await db.collection("sessions").doc(docID).update({
      status : "Confirmed",
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
      status : "Pending",
      trainer_id: ""
    }).then((response) => {
    }).catch((error) => {
      console.log("Error occurred while updating session as started: "+error);
    })
  }

  async createSession(userId: string, reqDate: string, startTime: string, endTime: string, location: string,
    landmark: string, expIndex: number, desc: string
  ){
    const db = firebase.firestore();

    await addDoc(collection(this.firestore, "sessions"), {
        userInfoId: userId,
        createdDate: new Date().toDateString(),
        date: reqDate,
        startTime: startTime,
        endTime: endTime,
        location: location,
        landmark: landmark,
        expIndex: expIndex,
        description: desc,
    })
  }
}
