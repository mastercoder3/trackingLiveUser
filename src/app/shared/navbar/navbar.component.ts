import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  uid;

  constructor(private router: Router) {
    this.uid = localStorage.getItem('tuid')
   }

  ngOnInit() {
  }

  signout(){
    localStorage.removeItem('tuid')
    localStorage.removeItem('booking')
    this.router.navigate(['']);
  }

}
