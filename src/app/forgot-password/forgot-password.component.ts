import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobelConstants } from '../shared/globel.constant';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forogotPasswordForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder: FormBuilder, private router: Router, 
    private userService: UserService, private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>, private ngxService: NgxUiLoaderService ) { }
    

  ngOnInit(): void {
    this.forogotPasswordForm = this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobelConstants.emailRegex)]],
 })
  }
 
  handleSubmit(){
    this.ngxService.start();
    var formData = this.forogotPasswordForm.value;
    var data = {
      email : formData.email 
    }
    this.userService.forgotPassword(data).subscribe((response:any)=>{
       this.ngxService.stop();
       this.dialogRef.close();
       this.responseMessage = response?.message;
       this.snackbarService.openSnackBar(this.responseMessage,"");
       this.router.navigate(['/']);
    }, (error) =>{
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

