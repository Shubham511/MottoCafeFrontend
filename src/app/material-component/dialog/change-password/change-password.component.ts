import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobelConstants } from 'src/app/shared/globel.constant';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm:any = FormGroup;
  responceMessage:any;

  constructor(private formBulider:FormBuilder, private router: Router, private userService: UserService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>, private ngxService: NgxUiLoaderService,
    private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBulider.group({
      oldpassword:[null,[Validators.required]],
      newpassword:[null,[Validators.required]],
      confirmpassword:[null,[Validators.required]],

    })
  }

  validateSubmit(){
    if(this.changePasswordForm.controls['newpassword'].value != this.changePasswordForm.controls['confirmpassword'].value){
      return true;
    }
    else{
      return false;
    }
  }

  handleChangePasswordSubmit(){
    this.ngxService.start();
    var formData = this.changePasswordForm.value;
    var data = {
      oldpassword:formData.oldpassword,
      newpassword:formData.newpassword,
      confirmpassword:formData.confirmpassword
    }
    this.userService.changePassowd(data).subscribe((responce:any)=>{
      this.ngxService.stop();
      this.responceMessage = responce?.message;
      this.dialogRef.close();
      this.snackbarService.openSnackBar(this.responceMessage, "Success");
    },(error)=>{
      console.log(error);
      if(error.error?.message){
        this.responceMessage = error.error?.message;
      }
      else{
        this.responceMessage = GlobelConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responceMessage,GlobelConstants.error);
    })


  }
}
