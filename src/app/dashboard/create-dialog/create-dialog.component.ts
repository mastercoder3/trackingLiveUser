import { Component, OnInit, Inject , HostListener} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormGroup, FormControl, NgForm, FormGroupDirective, Validators, FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/helper.service';
import * as global from '../../../global';
import {environment} from '../../../environments/environment'
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';

export interface DialogData {
  animal: string;
  name: string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.parent.invalid && control.touched;
  }
}

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.scss'],
  animations: [
    trigger('hideForms', [
      state('show', style({
        opacity: 1
      })),
      state('hide',   style({
        opacity: 0
      })),
      transition('show => hide', animate('600ms ease-out')),
      transition('hide => show', animate('3000ms ease-in'))
    ])
  ]
})


export class CreateDialogComponent implements OnInit {

  form: FormGroup;
  form1: FormGroup;
  form2: FormGroup;
  description:string;
  matcher = new MyErrorStateMatcher();
  showForm: boolean = false;
  showForm1: boolean = false;
  showForm2: boolean = false;
  showForm3: boolean = false;
  box;
  selected;
  current: number = 0;
  terms: boolean = false;
  prohibit: boolean = false;
  par;
  order;
  showSpinner: boolean = false;
  showForm4: boolean = false;
  newOrder;
  getOrders;
  handler: any;

  constructor(
    private fb: FormBuilder,
    private api: ApiService, private helper: HelperService,
        private dialogRef: MatDialogRef<CreateDialogComponent>,
        @Inject(MAT_DIALOG_DATA)  public data: DialogData, public snackBar: MatSnackBar
  ) { 
    // this.description = data.description;
    this.order = JSON.parse(localStorage.getItem('booking'));
  }

  ngOnInit() {
    this.showForm = true;
    // this.showSpinner = true;
    this.setStripes();
    this.form = this.fb.group({
      sendername: ['', Validators.required],
      country: ['United Arab Emirates', Validators.required],
      phonecode:[`United Arab Emirates ${this.order.fromCode}`, Validators.required],
      phone:['', Validators.compose([Validators.required, Validators.maxLength(13)])],
      city: [this.order.from, Validators.required],
      region: ['',Validators.required],
      street: [''],
      building: ['', Validators.required],
      office: ['', Validators.required],
      addresstype: ['Residential',Validators.required],
      nearestlandmark: ['']
      });

      this.form1 = this.fb.group({
        recipientname: ['', Validators.required],
        country: [this.order.destination, Validators.required],
        phonecode:[`${this.order.destination} ${this.order.destCode}`, Validators.required],
        phone:['', Validators.compose([Validators.required, Validators.maxLength(13)])],
        city: ['', Validators.required],
        region: ['',Validators.required],
        street: [''],
        building: ['', Validators.required],
        office: ['', Validators.required],
        addresstype: ['Residential',Validators.required],
        nearestlandmark: ['']
      });



      this.api.getBoxes()
        .subscribe(res =>{
          this.box = res;
          this.selected = this.box[0];
          this.current = 0;
          let w = (this.selected.length*this.selected.width*this.selected.height)/5000;
          let pickup = false;
          if(!this.order.price.startsWith('Saver')){
            pickup = true;
          }
          this.form2 = this.fb.group({
            length: [this.selected.length,Validators.required],
            width: [this.selected.width,Validators.required],
            height: [this.selected.height,Validators.required],
            actualweight: [this.order.weight, Validators.required],
            chargableweight: [( w < this.order.weight)  ? this.order.weight : w],
            itemvalue: [0,Validators.required],
            itemdescription: [''],
            units: [1, Validators.required],
            pickup: [pickup]
            
          });
          this.onChanges();
        });

        this.api.getNewOrders()
          .subscribe(res => {
            this.getOrders = res;
          })

  }

  onChanges(){
    this.form2.get('length').valueChanges.subscribe( res => {
      let length = this.form2.value.length;
      let width = this.form2.value.width;
      let height = this.form2.value.height;
      let w = (length*width*height)/5000;
      this.form2.get('chargableweight').setValue((w > this.form2.value.actualweight) ? w : this.form2.value.actualweight);
    });
    this.form2.get('width').valueChanges.subscribe( res => {
      let length = this.form2.value.length;
      let width = this.form2.value.width;
      let height = this.form2.value.height;
      let w = (length*width*height)/5000;
      this.form2.get('chargableweight').setValue((w > this.form2.value.actualweight) ? w : this.form2.value.actualweight);

    });
    this.form2.get('height').valueChanges.subscribe( res => {
      let length = this.form2.value.length;
      let width = this.form2.value.width;
      let height = this.form2.value.height;
      let w = (length*width*height)/5000;
      this.form2.get('chargableweight').setValue((w > this.form2.value.actualweight) ? w : this.form2.value.actualweight);

    });
    this.form2.get('actualweight').valueChanges.subscribe(res =>{
      if(this.form2.value.actualweight < this.form2.value.chargableweight){
      let length = this.form2.value.length;
      let width = this.form2.value.width;
      let height = this.form2.value.height;
      let w = (length*width*height)/5000;
      this.form2.get('chargableweight').setValue((w > this.form2.value.actualweight) ? w : this.form2.value.actualweight);
      }
      else
        this.form2.get('chargableweight').setValue((this.form2.value.chargableweight > this.form2.value.actualweight) ? this.form2.value.chargableweight : this.form2.value.actualweight);

    })
  }

  get currentState(){
    return this.showForm ? 'show' : 'hide'
  }

  get currentState1(){
    return this.showForm1 ? 'show' : 'hide'
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  count: number = 0;
  next(){
    if(this.count === 0 && this.form.valid){
          if(this.showForm){
            this.showForm = false;
            this.showForm1 = true;
            this.count++;
      }
    }
    else if(this.count === 1 && this.form1.valid){
        if(this.showForm1){
          this.showForm1 = false;
          this.showForm2 = true;
          this.count++;
        }
    }
    else if(this.count === 2 && this.showForm2){
      this.showForm2=false;
      this.showForm3 = true;
      this.count++;
    }
    else if(this.count === 3 && this.form2.valid && this.showForm3){
      this.count++;
      this.showForm3 = false;
      this.showSpinner = true;
      setTimeout( () => {
        this.showSpinner = false;
        this.showForm4 = true;
      }, 2000);
      let amount = 0;
      if(this.order.price.startsWith('Saver')){
        let p = this.order.price.substring(18,this.order.price.length);
        amount = parseInt(p);
      }
      else{
        let p = this.order.price.substring(18,this.order.price.length);
        amount = parseInt(p);
      }
      this.newOrder = {
        amount: amount,
        comments: '',
        date: new Date(),
        from: 'United Arab Emirates',
        insurance: false,
        insurancecharges: 0,
        orderconfirmed: false,
        orderid: '',
        orderstatus: 'pending',
        paymentmethod: '',
        paymentstatus: 'Unpaid',
        pickup: (this.form2.value.pickup === true) ? true : false,
        pickupaddress: '',
        pickupcharges: 0,
        pickupdate: '',
        pickuptime: '',
        to: this.form1.value.country,
        units: this.form2.value.units,
        userid: localStorage.getItem('tuid'),
        total: amount * this.form2.value.units,
        recipient: [
          {
            addresstype: this.form1.value.addresstype,
            building: this.form1.value.building,
            city: this.form1.value.city,
            country: this.form1.value.country,
            nearestlandmark: this.form1.value.nearestlandmark,
            office: this.form1.value.office,
            phone: `${this.order.destCode} ${this.form1.value.phone}`,
            recipientname: this.form1.value.recipientname,
            region: this.form1.value.region,
            street: this.form1.value.street
          }
        ],
        sender: [
          {
            addresstype: this.form.value.addresstype,
            building: this.form.value.building,
            country: 'United Arab Emirates',
            city: this.form.value.city,
            nearestlandmark: this.form.value.nearestlandmark,
            office: this.form.value.office,
            phone: `${this.order.fromCode} ${this.form.value.phone}`,
            sendername: this.form.value.sendername,
            region: this.form.value.region,
            street: this.form.value.street
          }
        ],
        shipment: [{
          actualweight: this.form2.value.actualweight,
          chargableweight: this.form2.value.chargableweight,
          height: this.form2.value.height,
          length: this.form2.value.length,
          width: this.form2.value.width,
          itemdescription: this.form2.value.itemdescription,
          itemvalue: this.form2.value.itemvalue,

        }]
      };
      this.generateId(this.newOrder.to, this.newOrder.shipment[0].chargableweight);

    }

  }

  nextBox(){
    if(this.current+1 <= this.box.length-1){
      this.selected = this.box[this.current+1];
      this.current++;
      this.form2.controls['length'].setValue(this.selected.length);
      this.form2.controls['width'].setValue(this.selected.width);
      this.form2.controls['height'].setValue(this.selected.height);
      // this.form2.value.length = this.selected.length;
      // this.form2.value.width = this.selected.width;
      // this.form2.value.height = this.selected.height;
    }
    else if(this.current+1 === this.box.length){
      this.selected = this.box[0];
      this.current = 0;
      this.form2.controls['length'].setValue(this.selected.length);
      this.form2.controls['width'].setValue(this.selected.width);
      this.form2.controls['height'].setValue(this.selected.height);
    }
  }

  previousBox(){
    if(this.current-1 !== -1){
      this.selected = this.box[this.current-1];
      this.current--;
      this.form2.controls['length'].setValue(this.selected.length);
      this.form2.controls['width'].setValue(this.selected.width);
      this.form2.controls['height'].setValue(this.selected.height);
    }
    else if(this.current-1 === -1){
      this.current = this.box.length -1;
      this.selected = this.box[this.current];
      this.form2.controls['length'].setValue(this.selected.length);
      this.form2.controls['width'].setValue(this.selected.width);
      this.form2.controls['height'].setValue(this.selected.height);
    }
  }

  cod(){
    this.newOrder.paymentmethod = 'Cash On Delivery';
    this.api.createOrder(this.newOrder)
      .then(res => {
        this.close();
      }, err =>{
        console.log(err);
      });
  }

  id: string = '';

  generateId(country,weight){
    this.helper.getCountries()
      .subscribe(res =>{
        let count = res;
        count = count.filter(data => data.name === country);
        let code = count[0].code;
        let order = this.getOrders.filter(data =>
          (new Date(data.date.toDate()).getMonth() + 1 ) === new Date().getMonth() +1 && 
          new Date(data.date.toDate()).getDate() === new Date().getDate() && 
          new Date(data.date.toDate()).getFullYear() === new Date().getFullYear()
         );
         //Order Id
        if(order.length === 0){
          this.id = `${code}001`;
        }
        else if(order.length < 10){
          this.id = `${code}00${order.length+1}`;
        }
        else if(order.length < 100){
          this.id = `${code}0${order.length+1}`;
        }
        else if(order.length < 1000){
          this.id = `${code}${order.length+1}`;
        }
        //Weight
        if(weight < 10){
          this.id = `${this.id}0${weight}`;
        }
        else if(weight < 100){
          this.id = `${this.id}${weight}`;
        }
        else{
          this.id = `${this.id}${weight}`;
        }
        let date = new Date().getDate();
        let month = new Date().getMonth() +1;
        let year = new Date().getFullYear();
        let yearr = year.toString().substring(2,4);

        // date
        this.id = `${this.id}${date}${month}${yearr}`
        this.newOrder.orderid = this.id;
        console.log(this.newOrder);
      });
  }

  pay(){
    this.newOrder.paymentmethod = 'Cash On Delivery';
      this.handler.open({
        name: 'Payment',
        description: 'Pay Using Credit Card'
      });
  }

  @HostListener('window:popstate')

  onPopState(){
    this.handler.close();
  }

  setStripes(){
    this.handler = global.StripeCheckout.configure({
      key: environment.stripeKey,
      image: 'https://firebasestorage.googleapis.com/v0/b/trackinglive-89835.appspot.com/o/logo%2FShirt-picture.png?alt=media&token=040a6ad9-5ad6-4e03-ae7f-f3f871a53311',
      locale: 'auto',
      token: token =>{
        this.helper.simpleHttp(this.newOrder.total* 100, token)
          .subscribe( res => {
            if(res.status === 200){
              this.openSnackbar('Payment Accepted');
                  this.api.createOrder(this.newOrder)
                  .then(res => {
                    this.close();
                    localStorage.removeItem('booking');
                  }, err =>{
                    console.log(err);
                  });
            }
            else{
              this.openSnackbar('Payment Rejected.');
            }
          })
      }
    });
  }

  openSnackbar(msg){
    let config = new MatSnackBarConfig();
    config.duration = 5000;
    config.panelClass = ['red-snackbar']
    this.snackBar.open(msg, 'Dismiss', config);
  }



}
