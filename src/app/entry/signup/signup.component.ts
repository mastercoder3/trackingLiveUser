import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.form = this.fb.group({
      fname: ['',Validators.required],
      lname: ['', Validators.required],
      country: ['', Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],

    })
  }

  signin(){
    this.router.navigate(['/signin']);
  }

}
