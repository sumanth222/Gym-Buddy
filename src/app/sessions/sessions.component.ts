import { Component } from '@angular/core';
import { FirebaseService } from 'src/services/firebase.service';
import { SessionObject } from '../objects/session-object';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
export class SessionsComponent {

  pendingSessions: SessionObject[] = [];

  constructor(private firebaseService: FirebaseService, private router: Router){}

  async ngOnInit(){
    this.getPendingSessions();
    console.log(this.pendingSessions.length);
  }

  async getPendingSessions(){
    await this.firebaseService.getSessions("Pending").then((sessions) => {
      this.pendingSessions = sessions;
    })
  }

  async getUpcomingSessions(){
    await this.firebaseService.getSessions("Upcoming").then((sessions) => {
      this.pendingSessions = sessions;
    })
  }

  async getCompletedSessions(){
    await this.firebaseService.getSessions("Completed").then((sessions) => {
      this.pendingSessions = sessions;
    })
  }

  goToSession(id: string){
    console.log("ID is: "+id);
    this.router.navigate(['/session-detail', id]);
  }
}
