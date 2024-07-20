import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/services/user-service.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  isTrainer: boolean = false;

  constructor(private router: Router, private userService: UserServiceService){

  }

  ngOnInit(){
    let userObj = this.userService.getUserObject();
    if(userObj.role == "trainer"){
      this.isTrainer = true;
    }
  }

  registerPage(){
    this.router.navigate(['/register'])
  }

  sessionsPage(){
    this.router.navigate(['/sessions'])
  }
}
