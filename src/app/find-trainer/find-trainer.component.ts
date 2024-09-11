import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/services/firebase.service';
import { DialogComponent } from '../dialog/dialog.component';
import { TrainerObject } from '../objects/trainer-object';
import { RequestTrainerServiceService } from 'src/services/request-trainer-service.service';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-find-trainer',
  templateUrl: './find-trainer.component.html',
  styleUrl: './find-trainer.component.css'
})
export class FindTrainerComponent {

  gymsAndTrainers: Map<string, TrainerObject[]> = new Map<string, TrainerObject[]>();
  filteredGyms: string[] = [];
  userGym: string = "";
  trainers: TrainerObject[] | undefined = [];
  startTimes: string[] = ['5:00 AM','5:30 AM','6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM',
    '10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
    '5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM'];
  
  endTimes: string[] = ['6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM',
    '10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
    '5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM','10:00 PM'];

  constructor(private firebaseService: FirebaseService, private dialog: MatDialog, private requestTrainerServ: RequestTrainerServiceService,
    private router: Router, private _location: Location
  ){}

  async ngOnInit(){
    await this.firebaseService.getAllGyms().then((gymsAndTrainers) => {
      this.gymsAndTrainers = gymsAndTrainers;
    });
  }

  filterGyms(){
    console.log(this.userGym);
    this.filteredGyms = [];
    this.gymsAndTrainers.forEach((trainer, gym) => {
      if(gym.includes(this.userGym)){
        this.filteredGyms.push(gym);
      }
    })
  }

  searchGym(){
    console.log("Searching for: "+this.userGym)
    this.filteredGyms.forEach((gym) => console.log(gym))
    if(!this.filteredGyms.includes(this.userGym)){
      this.dialog.open(DialogComponent, {
        data: {
          content: "Kindly select an option from the available options"
        }
      })
    }
    else{
      console.log("UserGym is: "+this.userGym)
      this.gymsAndTrainers.forEach((trainer, gym) => {
        if(gym.includes(this.userGym)){
          console.log("Map vals: "+gym+ " values: "+trainer)
        }
      })
      this.trainers = this.gymsAndTrainers.get(this.userGym);
      console.log("Trainers: "+this.trainers);
      this.trainers?.forEach((trainer) => {
        console.log(trainer.username)
      })
    }
  }

  requestSession(trainer: TrainerObject){
    console.log("Clicked on trainer: "+trainer.username);
    this.requestTrainerServ.setTrainer(trainer);
    this.router.navigate(['/request-trainer'])
    
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
