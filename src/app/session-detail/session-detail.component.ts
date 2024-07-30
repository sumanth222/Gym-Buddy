import { Component } from '@angular/core';
import { UserServiceService } from 'src/services/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/services/firebase.service';
import { TrainerInfoService } from 'src/services/trainer-info.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { UtilityServiceService } from '../util/utility-service.service';

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

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService, private trainerObjService: TrainerInfoService,
    private dialog: MatDialog, private router: Router, private utilityService: UtilityServiceService
  ){

  }

  async ngOnInit(){
    this.sessionId = this.route.snapshot.paramMap.get('id');


    console.log(this.trainerObjService.getTrainerObj().rate);
    await this.firebaseService.getSessionById(this.sessionId).then((session) => {
      this.username = session.username;
      this.date = session.requested_date;
      this.time = session.startTime;
      this.description = session.description;
      this.location = session.locality;
      this.hours = session.hours
      this.status = session.status;
    })
    this.rate = parseInt(this.trainerObjService.getTrainerObj().rate) * this.utilityService.getHours(this.hours);
  }

  confirmSession(){
    let trainerId = this.trainerObjService.getTrainerObj().id;

    let dialogRef = this.dialog.open(DialogComponent, {
      data: {
        content: new String("Are you sure you want to takeup this session? Click on Ok to confirm or Close to cancel.")
      }
    })
    dialogRef.afterClosed().subscribe((response) => {
      console.log(response);
      if("ok" == response){
        this.firebaseService.confirmSession(this.sessionId, trainerId);
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
        this.firebaseService.startSession(this.sessionId);
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
}
