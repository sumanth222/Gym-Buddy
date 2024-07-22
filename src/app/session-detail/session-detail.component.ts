import { Component } from '@angular/core';
import { UserServiceService } from 'src/services/user-service.service';
import { UserObject } from '../objects/user-object';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/services/firebase.service';

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

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService){

  }

  async ngOnInit(){
    this.sessionId = this.route.snapshot.paramMap.get('id');

    await this.firebaseService.getSessionById(this.sessionId).then((session) => {
      console.log(session.user_id)
      this.username = session.user_id
      this.date = session.requested_date;
      this.time = session.requested_time;
      this.description = session.description;
      this.location = session.location;
    })
  }

}
