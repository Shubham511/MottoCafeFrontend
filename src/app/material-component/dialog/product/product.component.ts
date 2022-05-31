import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobelConstants } from 'src/app/shared/globel.constant';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm : any = FormGroup;
  dialogAction : any = "Add";
  action : any = "Add";
  responseMessage : any;
  categorys:any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData : any, private formBilder: FormBuilder,
  private productService : ProductService, private dialogRef : MatDialogRef<ProductComponent>,
  private snackBarService: SnackbarService, private categoryService:CategoryService) { }

  ngOnInit(): void {
    this.productForm = this.formBilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobelConstants.nameRegex )]],
      categoryId:[null,[Validators.required]],
      price:[null,[Validators.required]],
      description:[null,[Validators.required]]
    });
    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action = "Update";
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategorys();
  }
 getCategorys(){
   this.categoryService.getCategorys().subscribe((response:any)=>{
     this.categorys = response;
   },(error:any)=>{
    if(error.error?.massage){
      this.responseMessage = error.error?.massage;
    }
    else{
      this.responseMessage = GlobelConstants.genericError;
    } 
    this.snackBarService.openSnackBar(this.responseMessage,GlobelConstants.error);
     
   })
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
    var formData = this.productForm.value;
    var data = {
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description
    }
    this.productService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddProduct.emit();
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
    var formData = this.productForm.value;
    var data = {
      id:this.dialogData.data.id,
      name:formData.name,
      categoryId:formData.categoryId,
      price:formData.price,
      description:formData.description
    }
    this.productService.update(data).subscribe((responce:any)=>{
      this.dialogRef.close();
      this.onEditProduct.emit();
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
