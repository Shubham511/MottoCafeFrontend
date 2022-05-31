import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobelConstants } from '../shared/globel.constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm:any = FormGroup;
  responseMessage: any;

  constructor(private formBulider:FormBuilder, private router: Router, private userService: UserService,
    private dialogRef: MatDialogRef<LoginComponent>, private ngxService: NgxUiLoaderService,
    private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.loginForm = this.formBulider.group({
      email:[null,(Validators.required,Validators.pattern(GlobelConstants.emailRegex))],
      password:[null,[Validators.required]],

    })
  }

  handleSubmit(){
    this.ngxService.start();
    var formdata = this.loginForm.value
    var data ={
      email : formdata.email,
      password : formdata.password
    } 
    this.userService.login(data).subscribe((response:any) =>{
      this.ngxService.stop();
      this.dialogRef.close();
      localStorage.setItem('token',response.token);
      
      this.router.navigate(['cafe/dashboard']);
      // console.log('token');
    },(error)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobelConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobelConstants.error); 
    })
  }

}
