import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { FirebaseService } from 'src/services/firebase.service';
import { UserServiceService } from 'src/services/user-service.service';

interface Timezone{
  value: string
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private dialog : MatDialog, private firebaseService: FirebaseService, private userService: UserServiceService){
    
  }

  timezones : Timezone[] = [
    {value: 'AM'},
    {value: 'PM'}
  ]

  exp: number = 0;
  about: string = "";
  avail: string = "";
  rates: string[] = [
    "₹200 - ₹400",
    "₹400 - ₹600",
    "₹600 - ₹800"
  ]
  nextPage: boolean = false;
  selected: any;
  expYears: string = "";
  rateIndex = 0;
  availDays: string = "";

  ngOnInit(){
    console.log("Selected: "+this.selected)
    console.log(this.userService.getUserObject().id)
  }

  validateAndNext(){
    if(this.exp != 0 && this.avail != "" && this.selected != undefined && this.about != ""){
      this.nextPage = true;
    }
    else{
      this.dialog.open(DialogComponent,{
        data: {
          content: new String("Kindly enter all the details and then click on Next"),
        }
      })
    }
  }

  onChangeExp(){
    this.expYears = (this.exp/12).toFixed(1);
    if(this.exp >= 12 && this.exp <= 30){
      this.rateIndex = 0;
    }
    else if(this.exp > 30 && this.exp <= 54){
      this.rateIndex = 1;
    }
    else if(this.exp > 54){
      this.rateIndex = 2;
    }
  }

  togglePage(){
    this.nextPage = false;
  }

  registerAsTrainer(){
    let userObj = this.userService.getUserObject();
    this.firebaseService.registerTrainer(userObj.id, userObj.username, this.exp, this.availDays, this.avail, this.selected, this.about);
  }
}
