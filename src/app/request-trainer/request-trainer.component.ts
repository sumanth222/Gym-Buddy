import { Component } from '@angular/core';
import { TrainerObject } from '../objects/trainer-object';
import { RequestTrainerServiceService } from 'src/services/request-trainer-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { FirebaseService } from 'src/services/firebase.service';
import { UserObject } from '../objects/user-object';
import { UserServiceService } from 'src/services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {Location} from '@angular/common';


@Component({
  selector: 'app-request-trainer',
  templateUrl: './request-trainer.component.html',
  styleUrl: './request-trainer.component.css'
})
export class RequestTrainerComponent {

  trainer : TrainerObject = new TrainerObject();

  startTime: string = "";
  endTime: string = "";
  startTimes: string[] = ['5:00 AM','5:30 AM','6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM',
    '10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
    '5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM'];
    endTimes: string[] = ['6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM',
      '10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
      '5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM','10:00 PM'];
    duration: string = "";
    user: UserObject = new UserObject();
    date: Date = new Date();
    desc: string = "";


  constructor(private requestTrainerServ: RequestTrainerServiceService, private dialog: MatDialog, 
    private firebaseService: FirebaseService, private userService: UserServiceService, private snackbar: MatSnackBar,
    private router: Router, private _location: Location
  ){}

  ngOnInit(){
    this.trainer = this.requestTrainerServ.getTrainer();
    this.user = this.userService.getUserObject();
  }

  populateDuration(){
    if(this.startTime != "" && this.endTime != ""){
      let subtract = false;
      let endTimes = this.endTime.split(" ")[0];
      let startTimes = this.startTime.split(" ")[0];

      if(parseInt(endTimes.split(":")[1]) < parseInt(startTimes.split(":")[1])){
        subtract = true;
      }
      
      let minutes = Math.abs(parseInt(endTimes.split(":")[1]) - parseInt(startTimes.split(":")[1]));
      let hours = parseInt(endTimes.split(":")[0]) - parseInt(startTimes.split(":")[0]);

      console.log("Hours: "+hours + " Minutes"+minutes);

      if(hours > 0){
        if(subtract){
          hours = hours - 1;
        }
        this.duration = hours+"";
      }
      if(minutes != 0){
        this.duration += ":"+minutes
      }
    }
  }

  requestForSession(){
    console.log("Requesting by "+this.user.username)
    
    if(this.startTime == "" || this.endTime == "" || this.desc == ""){
      this.dialog.open(DialogComponent, {
        data: {
          content: "Kindly select Start and End times a valid date and a short description before requesting a session."
        }
      })
    }
    else{
      let dialogRef = this.dialog.open(DialogComponent, {
        data: {
          content: "Are you sure you want to request a session with "+this.trainer.username+ " ?"  
        }
      })
      dialogRef.afterClosed().subscribe((response) => {
        console.log(response);
        if("ok" == response){
          this.firebaseService.requestForSession(this.trainer, this.user, this.date, this.startTime, this.endTime, this.desc, this.duration)
          this.router.navigate(['/home']);
          this.snackbar.open("Requested session with "+this.trainer.username)
        }
      })
    }
  }

  dateChanged(event: any){
    
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