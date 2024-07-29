import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { FirebaseService } from 'src/services/firebase.service';
import { UserServiceService } from 'src/services/user-service.service';
import { Router } from '@angular/router';

interface Timezone{
  value: string
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private dialog : MatDialog, private firebaseService: FirebaseService, private userService: UserServiceService,
    private router: Router
  ){
    
  }

  timezones : Timezone[] = [
    {value: 'AM'},
    {value: 'PM'}
  ]

  exp: number = 0;
  about: string = "";
  avail: string = "";
  rates: string[] = [
    "₹250",
    "₹450",
    "₹700"
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
    this.firebaseService.registerTrainer(userObj.id, userObj.username, 
      this.exp, this.availDays, this.avail, this.selected, this.about, this.rates[this.rateIndex])
      .then((response) => {
        //If there is some error while checking firestore and do not receive proper response
        if(response == null){
          this.dialog.open(DialogComponent,{
            data: {
              content: new String("An error occured, please try again."),
            }
          })
        }
        //If user has already registered as a trainer.
        else if(response == false){
          this.dialog.open(DialogComponent,{
            data: {
              content: new String("You have already registered as a trainer! If this is not the case, please contact support."),
            }
          })
        }
        //If none of the above cases, register as trainer and navigate to home screen
        else{
          this.firebaseService.updateUserAsTrainer(userObj.id);
          this.dialog.open(DialogComponent,{
            data: {
              content: new String("Registered as Trainer! Welcome aboard."),
            }
          })
          this.router.navigate(['home'])
        }
      })
  }
}
