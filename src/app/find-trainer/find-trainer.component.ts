import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/services/firebase.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-find-trainer',
  templateUrl: './find-trainer.component.html',
  styleUrl: './find-trainer.component.css'
})
export class FindTrainerComponent {

  gymsAndTrainers: Map<string, string[]> = new Map<string, string[]>();
  filteredGyms: string[] = [];
  userGym: string = "";

  constructor(private firebaseService: FirebaseService, private dialog: MatDialog){}

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
    // console.log("Searching for: "+this.userGym)
    // this.filteredGyms.forEach((gym) => console.log(gym))
    // if(!this.filteredGyms.includes(this.userGym)){
    //   this.dialog.open(DialogComponent, {
    //     data: {
    //       content: "Kindly select an option from the available options"
    //     }
    //   })
    // }
  }
}
