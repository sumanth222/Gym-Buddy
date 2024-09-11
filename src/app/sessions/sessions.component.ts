import { Component } from '@angular/core';
import { FirebaseService } from 'src/services/firebase.service';
import { SessionObject } from '../objects/session-object';
import { Router } from '@angular/router';
import { TrainerInfoService } from 'src/services/trainer-info.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import {Location} from '@angular/common';


@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
export class SessionsComponent {

  pendingSessions: SessionObject[] = [];
  screenHeight: number = 0;
  trainerId: string = "";
  sessionHeader: string  = "";

  constructor(private firebaseService: FirebaseService, private router: Router, private trainerService: TrainerInfoService,
    private dialog: MatDialog, private _location: Location
  ){}

  async ngOnInit(){
    this.getPendingSessions();
    this.screenHeight = screen.height - 56;
    this.trainerId = this.trainerService.getTrainerObj().id
    console.log("Trainer ID is: "+this.trainerId);
  }

  async getPendingSessions(){
    this.sessionHeader = "Pending Sessions"
    await this.firebaseService.getSessions("Pending", this.trainerId).then((sessions) => {
      this.pendingSessions = sessions;
    })
  }

  async getUpcomingSessions(){
    this.sessionHeader = "Upcoming Sessions"
    await this.firebaseService.getSessions("Confirmed", this.trainerId).then((sessions) => {
      this.pendingSessions = sessions;
    })
  }

  async getCompletedSessions(){
    this.sessionHeader = "Completed Sessions"
    await this.firebaseService.getSessions("Completed", this.trainerId).then((sessions) => {
      this.pendingSessions = sessions;
    })
  }

  goToSession(id: string){
    console.log("ID is: "+id);
    this.router.navigate(['/session-detail', id]);
  }

  bookNewSession(){
    this.router.navigate(['/book-session'])
  }

  getRequestedSessions(){
    this.sessionHeader = "Requested Sessions"
    this.firebaseService.getRequestedSessions(this.trainerId).then((sessions) => {
      this.pendingSessions = sessions;
    })
  }

  getStartedSessions(){
    this.sessionHeader = "In-Progress Sessions"
    this.firebaseService.getSessions("Started", this.trainerId).then((sessions) => {
      this.pendingSessions = sessions;
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
