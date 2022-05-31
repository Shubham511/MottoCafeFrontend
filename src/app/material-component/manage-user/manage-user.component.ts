import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobelConstants } from 'src/app/shared/globel.constant';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {

  displayedColumns: string[] = ['name', 'contactNumber', 'email', 'status'];
  dataSource: any;
  responseMessage: any;

  constructor(private ngxService:NgxUiLoaderService, private userService:UserService,
    private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }
  tableData() {
    this.userService.getUser().subscribe((response: any) => {
      this.ngxService.stop();

      response.forEach((item: any)=>{
          item.status = JSON.parse(item.status);
      })

      console.log(response);
      
      this.dataSource = new MatTableDataSource(response);
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobelConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobelConstants.error);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
    handleChangeAction(status:any,id:any){
      this.ngxService.start();
      var data = {
        status:status.toString(),
        id:id
      }
      this.userService.update(data).subscribe((response:any)=>{
        this.ngxService.stop();
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage,"Success");
      }, (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        }
        else {
          this.responseMessage = GlobelConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobelConstants.error);
      })

  }

}
