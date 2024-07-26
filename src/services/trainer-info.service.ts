import { Injectable } from '@angular/core';
import { TrainerObject } from 'src/app/objects/trainer-object';

@Injectable({
  providedIn: 'root'
})
export class TrainerInfoService {

  constructor() { }

  trainerObj : TrainerObject = new TrainerObject();

  setTrainerObj(trainerObject: TrainerObject){
    this.trainerObj = trainerObject;
  }

  getTrainerObj(){
    return this.trainerObj;
  }
}
