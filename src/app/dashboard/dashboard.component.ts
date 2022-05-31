import { Component, AfterViewInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DashboardService } from '../services/dashboard.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobelConstants } from '../shared/globel.constant';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
 responceMessage:any;
 data:any;
	ngAfterViewInit() { }

	constructor(private dashboardSeervice:DashboardService,
		private ngxService:NgxUiLoaderService,
		private snackbarService:SnackbarService) {
			this.ngxService.start();
			this.dashboardData();
	}

	dashboardData(){
		this.dashboardSeervice.getDetails().subscribe((responce:any)=>{
			this.ngxService.stop();
			this.data = responce;
		},(error:any)=>{
			this.ngxService.stop();
			console.log(error);
			if(error.error?.meassage){
				this.responceMessage = error.error?.meassage;
			}
			else{
				this.responceMessage = GlobelConstants.genericError;
			}
			this.snackbarService.openSnackBar(this.responceMessage,GlobelConstants.error);
		})
	}
}
