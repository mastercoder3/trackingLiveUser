import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material";
import { CreateDialogComponent } from '../create-dialog/create-dialog.component';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss']
})
export class CreateNewComponent implements OnInit {

  lat: number = 25.0997528;
  lng: number = 55.1556513;
  order;
  par;
  phonecode;
  constructor(private dialog: MatDialog,private helper: HelperService) { }

  ngOnInit() {
    this.order = JSON.parse(localStorage.getItem('booking'));
    this.helper.getCountryPhoneCodes()
      .subscribe(res => {
          this.par = res;
          this.phonecode = this.par.filter(data => data.name === this.order.destination);
          this.order.destCode = `(${this.phonecode[0].dial_code})`;
          this.phonecode = this.par.filter(data => data.name === 'United Arab Emirates');
          this.order.fromCode = `(${this.phonecode[0].dial_code})`;
          let x = {from: this.order.from, destination: this.order.destination, weight: this.order.weight, price: this.order.price, destCode: this.order.destCode, fromCode: this.order.fromCode};
          localStorage.setItem('booking', JSON.stringify(x));    
          setTimeout( ()=>{
                this.openDialog();
              }, 500);
      })

  }

  openDialog(): void {

    const dialogRef = this.dialog.open(CreateDialogComponent, {
      minWidth: '492px',
      maxHeight: '100%',
      panelClass: ['animated','slideInUp'],
      disableClose: true,
      autoFocus: false,
      data: {se: ''}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed:');
      console.log(result);
    });
  }

}
