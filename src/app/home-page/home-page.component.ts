import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/services/firebase.service';
import { UserServiceService } from 'src/services/user-service.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  isTrainer: boolean = false;

  constructor(private router: Router, private userService: UserServiceService, private firebaseService: FirebaseService,
    private dialog: MatDialog
  ){

  }

  ngOnInit(){
    let userObj = this.userService.getUserObject();
    if(userObj.role == "trainer"){
      this.isTrainer = true;
    }
    console.log("ID of user is: "+userObj.id)
  }

  registerPage(){
    this.router.navigate(['/register'])
  }

  sessionsPage(){
    this.router.navigate(['/sessions'])
  }

  bookNewSession(){
    this.router.navigate(['/book-session'])
  }

  findTrainer(){
    this.router.navigate(['find-trainer'])
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

  requestedSessions(){
    console.log("hi")
  }
}
