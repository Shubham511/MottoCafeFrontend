import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobelConstants } from 'src/app/shared/globel.constant';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'total', 'view'];
  dataSource: any = [];
  responseMessage: any;

  constructor( private dialog: MatDialog,private router:Router, private snackBarService: SnackbarService,
    private billService: BillService, private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(){
    this.billService.getBill().subscribe((reponse:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(reponse);
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.massage) {
        this.responseMessage = error.error?.massage;
      }
      else {
        this.responseMessage = GlobelConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobelConstants.error);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleViewAction(values:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data : values
    }
    dialogConfig.width ="100%";
    const dialogRef = this.dialog.open(ViewBillProductsComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    })

  }

  downloadReportAction(values:any){
    this.ngxService.start();
    var data ={
      name:values.name,
      email:values.email,
      uuid:values.uuid,
      contactNumber:values.contactNumber,
      paymentMethod:values.paymentMethod,
      totalAmount:values.total,
      productDetails:values.productDetails
    }
    this.billService.getPDF(data).subscribe((response:any)=>{
      saveAs(response,values.uuid+'.pdf');
      this.ngxService.stop();
    })


  }

  handleDeleteAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + values.name + ' bill'
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChanges.subscribe((response) => {
      this.ngxService.start();
      this.deleteProduct(values.id);
      dialogRef.close();
    })

  }
  deleteProduct(id: any) {
    this.billService.delete(id).subscribe((response: any) => {
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackBarService.openSnackBar(this.responseMessage, "Success");
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobelConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobelConstants.error);
    })
  }
}
 