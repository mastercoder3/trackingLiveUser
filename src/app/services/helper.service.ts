import { Injectable } from '@angular/core';
import { Http, RequestOptions,Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  
  constructor(private http: Http) { }

  getCountries(){
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');    
       let options = new RequestOptions({ headers: myHeaders });
    return this.http.get('./assets/data/countries.json',options)
    .pipe(map((this.extractData)))
  }

  extractData(res){
    let body = res.json();
    return body;
  }

  handleError (error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
    }

}
