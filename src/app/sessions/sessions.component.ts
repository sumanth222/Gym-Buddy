import { Component } from '@angular/core';
import { FirebaseService } from 'src/services/firebase.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
export class SessionsComponent {

  constructor(private firebaseService: FirebaseService){}

  ngOnInit(){
    this.firebaseService.getPendingSessions();
  }

}
