import { Component } from '@angular/core';
import { traineeRates, trainerExperiences } from '../app.constants';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { FirebaseService } from 'src/services/firebase.service';
import { UserServiceService } from 'src/services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-session',
  templateUrl: './book-session.component.html',
  styleUrl: './book-session.component.css'
})
export class BookSessionComponent {

  startTime: string = "";
  endTime: string = "";
  duration: string = "";
  screenHeight: number = 0;
  location: string = "";
  landmark: string = "";
  rates = traineeRates;
  hintIndex = 0;
  expIndex = 0;
  date: Date = new Date();
  desc: string = "";

  startTimes: string[] = ['5:00 AM','5:30 AM','6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM',
  '10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
  '5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM'];

  endTimes: string[] = ['6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM',
    '10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
    '5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM','10:00 PM'];

  experiences: string[] = trainerExperiences
  selectedExp: string = this.experiences[0];
  userInfoId: string = "";


  constructor(private dialog: MatDialog, private firebaseService: FirebaseService, private userService: UserServiceService,
    private snackbar: MatSnackBar, private router: Router
  ){}

  ngOnInit(){
    this.screenHeight = screen.height - 56;
    this.userInfoId  = this.userService.getUserObject().id;
  }

  populateDuration(){
    if(this.startTime != "" && this.endTime != ""){
      let endTimes = this.endTime.split(" ")[0];
      let startTimes = this.startTime.split(" ")[0];

      let minutes = Math.abs(parseInt(endTimes.split(":")[1]) - parseInt(startTimes.split(":")[1]));
      let hours = parseInt(endTimes.split(":")[0]) - parseInt(startTimes.split(":")[0]);

      console.log("Hours: "+hours + " Minutes"+minutes);

      if(hours > 0){
        this.duration = hours+"";
      }
      if(minutes != 0){
        this.duration += ":"+minutes
      }
    }
  }

  selectExp(index: number){
    console.log("Index is: "+index)
    this.hintIndex = index;
    this.expIndex = index;
  }

  requestSession(){
    if(this.startTime == "" || this.endTime == "" || this.location == "" || this.selectedExp == "" || this.desc == ""){
      this.dialog.open(DialogComponent, {
        data: {
          content: "Please fill in all the details and then try again."
        }
      })
    }
    else{
      this.firebaseService.createSession(this.userInfoId, this.date.toDateString(), this.startTime, this.endTime, 
      this.location, this.landmark, this.expIndex, this.desc);
      this.router.navigate(['/home']);
      this.snackbar.open("Successfully requested for a session", "OK");
    }
  }

  dateChanged(event: any){
    console.log(this.date.toDateString())
  }
}
