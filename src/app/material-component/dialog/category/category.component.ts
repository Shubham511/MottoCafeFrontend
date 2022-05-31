import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobelConstants } from 'src/app/shared/globel.constant';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm : any = FormGroup;
  dialogAction : any = "Add";
  action : any = "Add";
  responseMessage : any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData : any, private formBilder: FormBuilder,
  private categoryService : CategoryService, private dialogRef : MatDialogRef<CategoryComponent>,
  private snackBarService: SnackbarService) { }

  ngOnInit(): void {
    this.categoryForm = this.formBilder.group({
      name:[null,[Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action = "Update";
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit(){
    if(this.dialogAction === "Edit"){
      this.edit();
    }
    else{
      this.add();
    }
  }

  add(){
    var formData = this.categoryForm.value;
    var data = {
      name:formData.name
    }
    this.categoryService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.responseMessage = response.message;
      this.snackBarService.openSnackBar(this.responseMessage, "Success");
    },(error:any)=>{
      this.dialogRef.close();
      if(error.error?.massage){
        this.responseMessage = error.error?.massage;
      }
      else{
        this.responseMessage = GlobelConstants.genericError;
      } 
      this.snackBarService.openSnackBar(this.responseMessage,GlobelConstants.error);
    })
  }

  edit(){
    var formData = this.categoryForm.value;
    var data = {
      id:this.dialogData.data.id,
      name:formData.name
    }
    this.categoryService.update(data).subscribe((responce:any)=>{
      this.dialogRef.close();
      this.onEditCategory.emit();
      this.responseMessage = responce.message;
      this.snackBarService.openSnackBar(this.responseMessage, "Success");
    },(error:any)=>{
      this.dialogRef.close();
      if(error.error?.message){
        this.responseMessage = error.error?.massage;
      }
      else{
        this.responseMessage = GlobelConstants.genericError;
      } 
      this.snackBarService.openSnackBar(this.responseMessage,GlobelConstants.error);
    })
  }

}
