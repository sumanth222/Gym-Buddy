import { Component } from '@angular/core';

interface Timezone{
  value: string
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  timezones : Timezone[] = [
    {value: 'AM'},
    {value: 'PM'}
  ]

  exp: string = "";

}
