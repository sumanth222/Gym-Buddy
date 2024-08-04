import { Injectable } from '@angular/core';
import { TrainerObject } from 'src/app/objects/trainer-object';

@Injectable({
  providedIn: 'root'
})
export class RequestTrainerServiceService {

  trainerObject: TrainerObject = new TrainerObject();

  constructor() { }

  public setTrainer(trainerObj: TrainerObject){
    this.trainerObject = trainerObj;
  }

  public getTrainer(): TrainerObject{
    return this.trainerObject;
  }
}
