import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper.service';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  filteredCities;
  stateCtrl = new FormControl();
  filteredCountries;
  stateCtrl1 = new FormControl();
  countries;
  prices;
  rates;
  pickup;
  countryCode;
  states = [
    {
      name:  "Abu Dhabi"
    },
    {
      name: "Al Ain"
    },
    {
      name: "Al Khan"
    },
    {
      name: "Ar Ruways"
    },
    {
      name: "As Satwah"
    },
    {
      name: "Dayrah"
    },
    {
      name: "Dubai"
    },
    {
      name:  "Fujairah"
    },
    {
      name: "Ras al-Khaimah"
    },
    {
      name: "Sharjah"
    }
  ];
  form: FormGroup;

  constructor(private helper: HelperService, private fb: FormBuilder, private api: ApiService, private router: Router) { 
    this.filteredCities = this.stateCtrl.valueChanges
    .pipe(
      startWith(''),
      map(state => state ? this._filterStates(state) : this.states.slice())
    );

    this.helper.getCountries()
      .subscribe(res =>{
        this.countries = res;
        this.filteredCountries = this.stateCtrl1.valueChanges
        .pipe(
          
          startWith(''),
          map(state => state ? this._filterStates1(state) : this.countries.slice())
        )
      });
  }

  ngOnInit() {
    this.form = this.fb.group({
      from: ['', Validators.required],
      weight: ['', Validators.required],
      destination: ['', Validators.required],
      price: ['',Validators.required]
  });
    this.onChanges();
    this.api.getPricingById('pickup')
      .subscribe(res =>{
        this.pickup = res;
      });
  }

  private _filterStates(value: string) {
    const filterValue = value.toLowerCase();

    if(value.length > 2)
    return this.states.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

    
  private _filterStates1(value: string) {

    const filterValue = value.toLowerCase();

    return this.countries.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  

}

onChanges(){
  this.form.get('destination').valueChanges.subscribe(res =>{
    let x = this.countries.filter(data => data.name === res);
    if(x.length !== 0)
      this.countryCode = x[0].code;
    if(res !== '' ){
      this.form.get('weight').valueChanges.subscribe(weigh => {
        if(weigh != 0){
          this.getPrices(res);
        }
      });
    }
  });

}

getPrices(dest){
  this.api.getPrice(dest)
    .pipe(map(actions => actions.map(a =>{
      const did = a.payload.doc.id;
      const data = a.payload.doc.data();
      return {did, ...data};
    })))
    .subscribe(res =>{
      this.rates = res;
      if(this.rates.length !== 0){
         let x  = this.rates[0].rates;
          this.prices = x.filter(data =>  data.maxweight === this.form.get('weight').value && data.perkg === false);

          if(this.prices.length !== 0)
            this.form.value.price =  this.prices[0].price

          if(this.prices.length === 0){
            this.prices = x.filter(data =>  data.maxweight >= this.form.get('weight').value && data.minweight <= this.form.get('weight').value && data.perkg === true);
            if(this.prices.length !== 0)
            this.form.value.price =  this.prices[0].price * parseInt(this.form.get('weight').value)
          }
      }
    
    });
}

  total;

  submit(form){
    let data = {
      from: this.form.get('from').value,
      destination: this.form.get('destination').value,
      weight: this.form.get('weight').value,
      price: this.total
    }
    localStorage.setItem('booking',JSON.stringify(data));
    
    if(localStorage.getItem('tuid'))
        this.router.navigate(['/create-new']);
    else  
        this.router.navigate(['/signin'])
  }

  onSelect(event){
    if(event.startsWith('Saver')){
      this.total = this.form.get('price').value;
    }
    else if(event.startsWith('Pickup')){
      this.total = this.form.get('price').value + this.pickup.charges;
    }
  }

}
