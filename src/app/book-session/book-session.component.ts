import { Component } from '@angular/core';
import { rupeeChar, traineeRates, trainerExperiences } from '../app.constants';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { FirebaseService } from 'src/services/firebase.service';
import { UserServiceService } from 'src/services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UtilityServiceService } from '../util/utility-service.service';

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
  state: string = "";
  pincode: string = "";
  gymname: string = "";
  locality: string = "";

  startTimes: string[] = ['5:00 AM','5:30 AM','6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM',
  '10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
  '5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM'];

  endTimes: string[] = ['6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM',
    '10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
    '5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM','10:00 PM'];

  states: string[] = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
    'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
    'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim',
    'Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal']

  experiences: string[] = trainerExperiences
  selectedExp: string = this.experiences[0];
  userInfoId: string = "";
  username: string = "";
  traineeRates = traineeRates;


  constructor(private dialog: MatDialog, private firebaseService: FirebaseService, private userService: UserServiceService,
    private snackbar: MatSnackBar, private router: Router, private utilityService: UtilityServiceService
  ){}

  ngOnInit(){
    this.screenHeight = screen.height - 56;
    this.userInfoId  = this.userService.getUserObject().id;
    this.username = this.userService.getUserObject().username;
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

  selectExp(index: number){
    console.log("Index is: "+index)
    this.hintIndex = index;
    this.expIndex = index;
  }

  requestSession(){
    if(this.startTime == "" || this.endTime == "" || this.locality == "" || this.selectedExp == "" || this.desc == ""
      || this.gymname == "" || this.pincode == "" || this.state == ""
    ){
      this.dialog.open(DialogComponent, {
        data: {
          content: "Please fill in all the details and then try again."
        }
      })
    }
    else{
      let hours = this.utilityService.getHours(this.duration);
      let rate = (hours*parseInt(this.traineeRates[this.expIndex]));
      let dialogRef = this.dialog.open(DialogComponent, {
        data: {
          content: "Based on your selected preferences, the fees for your training session would be "+rupeeChar+rate+". Tap OK to continue."
        }
      })
      dialogRef.afterClosed().subscribe((response) => {
        console.log(response);
        if("ok" == response){
          this.firebaseService.createSession(this.userInfoId, this.username, this.date.toDateString(), this.startTime, this.endTime, 
          this.landmark, this.expIndex, this.desc, this.gymname, this.locality, this.pincode, this.state, this.duration);
          this.router.navigate(['/home']);
          this.snackbar.open("Successfully requested for a session", "OK");
        }
      })
      
    }
  }

  dateChanged(event: any){
    console.log(this.date.toDateString())
  }

  selectState(index: number){
    this.state = this.states[index];
  }
}
