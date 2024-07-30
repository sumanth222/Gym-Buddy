import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityServiceService {

  constructor() { }

  getHours(time: string): number {
    let splitTime = time.split(":");
    let hours = splitTime[0];
    if(splitTime[1] == "30"){
        hours+=".5";
    } 
    return parseFloat(hours);
}
}
