import { Component } from '@angular/core';
import firebase from "firebase/compat/app";
import { firebaseConfig } from 'src/environments/environment';
import { RecaptchaVerifier, PhoneAuthProvider, getAuth, signInWithCredential } from '@firebase/auth';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/services/firebase.service';
import { UserObject } from '../objects/user-object';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  buttonText: string = "Send OTP";
  username: string = "";
  phoneNumber: string = "";
  otp: string = "";
  app: any;
  auth : any;
  verificationId: string=  "";
  disabled: boolean = true
  cityState: string = "";
  userObject : UserObject = new UserObject;

  constructor(private router: Router, private firebaseService: FirebaseService){
    this.app = firebase.initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
  }


  async actionDetails(){
    if(this.otp == ""){
      if(this.username != "" && this.phoneNumber != "" && this.cityState != ""){
        await this.createAccount();
        this.buttonText = "Verify and register"
      }
    }
    else{
      this.verifyAndRegister();
    }
  }

  async createAccount(){
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
    }
  }

  async verifyAndRegister(){
    const authCredential = PhoneAuthProvider.credential(this.verificationId, this.otp);
    const userCredential = await signInWithCredential(this.auth, authCredential).then((result) => {
        console.log("Logged in success"+result);
        this.firebaseService.createUserInfo(this.username, this.phoneNumber, this.cityState)
        
        this.router.navigate(['/login'])
      })
      .catch((error: any) => {
        console.log("Error while logging in "+error);
        this.disabled = false;
    });
  }

}


