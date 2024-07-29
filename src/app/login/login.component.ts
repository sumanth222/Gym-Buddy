import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseService } from 'src/services/firebase.service';
import { DialogComponent } from '../dialog/dialog.component';
import { RecaptchaVerifier, PhoneAuthProvider, getAuth, signInWithCredential } from '@firebase/auth';
import firebase from "firebase/compat/app";
import { firebaseConfig } from 'src/environments/environment';
import { Router } from '@angular/router';
import { UserObject } from '../objects/user-object';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  verificationId: string = "";
  app: any;
  auth: any;

  constructor(private firebaseService: FirebaseService, private dialog: MatDialog,
    private router: Router, private snackBar: MatSnackBar
  ){
    this.app = firebase.initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
  }

  phoneNumber: string = "";
  otp: string = "";
  disabled: boolean = true;
  buttonText: string = "Send OTP"
  userObject: UserObject = new UserObject;

  actionDetails(){
    if(this.phoneNumber == "" || this.phoneNumber.length != 10){
      this.dialog.open(DialogComponent,{
        data: {
          content: new String("Kindly enter a valid phone number"),
        }
      })
    }
    else if(this.otp == ""){
      this.firebaseService.checkIfUserExists(this.phoneNumber).then((response) => {
        if(response == null || response == true){
          this.initiateLogin();
        }
        else{
          this.dialog.open(DialogComponent,{
            data: {
              content: new String("Could not find the entered number, kindly try signing up first."),
            }
          })
        }
      })
    }
    else if(this.otp != ""){
      this.verifyAndLogin();
    }
  }

  async initiateLogin(){
    if(this.phoneNumber.length == 10){
      const appVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container',{
        size: 'invisible',
        callback:(response : any) => {
          console.log("Captcha verified");  
        }
      })
      const provider = new PhoneAuthProvider(this.auth);
      this.verificationId = await provider.verifyPhoneNumber("+91" + this.phoneNumber, appVerifier);
      this.disabled = false;
      this.buttonText = "Login"
    }
  }

  async verifyAndLogin(){
    const authCredential = PhoneAuthProvider.credential(this.verificationId, this.otp);
    const userCredential = await signInWithCredential(this.auth, authCredential).then((result) => {
        this.firebaseService.getUser(this.phoneNumber, this.userObject).then((user) => {
          console.log("Logged in user is" +user.id)
        })
        this.router.navigate(['/home'])
        this.snackBar.open("Log in success!", "OK");
      })
      .catch((error: any) => {
        console.log("Error while logging in "+error);
        this.disabled = false;
    });
  }

}
