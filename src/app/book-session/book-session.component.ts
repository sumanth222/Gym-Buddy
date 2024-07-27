import { Component } from '@angular/core';

@Component({
  selector: 'app-book-session',
  templateUrl: './book-session.component.html',
  styleUrl: './book-session.component.css'
})
export class BookSessionComponent {

  startTime: string = "";
  endTime: string = "";
  duration: string = "";

  startTimes: string[] = ['5:00 AM','5:30 AM','6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM',
  '10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
  '5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM'];

  endTimes: string[] = ['6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM',
    '10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
    '5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM','10:00 PM'];

  constructor(){}

  ngOnInit(){

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

}
