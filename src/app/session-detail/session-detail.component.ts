import { Component } from '@angular/core';
import { UserServiceService } from 'src/services/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/services/firebase.service';
import { TrainerInfoService } from 'src/services/trainer-info.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { UtilityServiceService } from '../util/utility-service.service';
import { TrainerObject } from '../objects/trainer-object';
import {Location} from '@angular/common';


@Component({
  selector: 'app-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrl: './session-detail.component.css'
})
export class SessionDetailComponent {

  username: string = "";
  sessionId: any = "";
  date: string = "";
  time: string = "";
  description : string = "";
  location: string = "";
  rate: number = 0;
  hours: string = "";
  status: string = "";
  trainerObj: TrainerObject = new TrainerObject();

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService, private trainerObjService: TrainerInfoService,
    private dialog: MatDialog, private router: Router, private utilityService: UtilityServiceService, private _location: Location
  ){

  }

  async ngOnInit(){
    this.sessionId = this.route.snapshot.paramMap.get('id');
    this.trainerObj = this.trainerObjService.getTrainerObj();


    console.log(this.trainerObjService.getTrainerObj().rate);
    await this.firebaseService.getSessionById(this.sessionId).then((session) => {
      this.username = session.username;
      this.date = session.requested_date;
      this.time = session.startTime;
      this.description = session.description;
      this.location = session.gymName + ((session.locality != "") ? " | "+session.locality : "");
      this.hours = session.hours
      this.status = session.status;
      this.rate = session.rate - 50;
    })
  }

  confirmSession(){

    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        content: new String("Are you sure you want to takeup this session? Click on Ok to confirm or Close to cancel.")
      }
    })
    dialogRef.afterClosed().subscribe((response) => {
      console.log(response);
      if("ok" == response){
        console.log("TID: "+this.trainerObj.id)
        this.firebaseService.confirmSession(this.sessionId, this.trainerObj.id);
        this.router.navigate(['/sessions'])
      }
    })
  }

  startSession(){
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        content: new String("Are you sure you want to start this session?")
      }
    })
    dialogRef.afterClosed().subscribe((response) => {
      console.log(response);
      if("ok" == response){
        console.log("TrainerID is:"+this.trainerObj.id)
        this.firebaseService.startSession(this.sessionId, this.trainerObj.id);
        this.router.navigate(['/sessions'])
      }
    })
  }

  cancelSession(){
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        content: new String("Are you sure you want to cancel this session?")
      }
    })
    dialogRef.afterClosed().subscribe((response) => {
      console.log(response);
      if("ok" == response){
        this.firebaseService.cancelSession(this.sessionId);
        this.router.navigate(['/sessions'])
      }
    })
  }

  endSession(){
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        content: new String("Are you sure you want to end this session?")
      }
    })
    dialogRef.afterClosed().subscribe((response) => {
      console.log(response);
      if("ok" == response){
        this.firebaseService.endSession(this.sessionId);
        this.router.navigate(['/sessions'])
      }
    })
  }

  goToHome(){
    this.router.navigate(['/home'])
  }

  logout(){
    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        content: "Do you want to logout?"  
      }
    })
    dialogRef.afterClosed().subscribe((response) => {
      console.log(response);
      if("ok" == response){
        this.firebaseService.signoutUser();
      }
    })
  }

  goBack(){
    this._location.back();
  }
}
