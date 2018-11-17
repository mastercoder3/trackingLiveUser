import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['',Validators.compose([Validators.email, Validators.required])],
      password: ['',Validators.required]
    })
  }

  login(form){
    
  }

  signup(){
    this.router.navigate(['/signup']);
  }

}
