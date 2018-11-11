import { Component, OnInit, DoCheck } from '@angular/core';
import {Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from './services/user-services.service';
import { GLOBAL } from './services/global';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
  title = 'NGSOCIAL';
  public identity:any = null;
  public url : string;
 

  constructor(
   private _userService: UserServices,
   private _route:ActivatedRoute,
   private _router : Router,
   
  ){
    this.url = GLOBAL.url;
  }
  ngOnInit(){
    this.identity = this._userService.getIdentity();
  }
  ngDoCheck(){
    this.identity = this._userService.getIdentity();
  }
  logout(){
    //borra todo lo que hay en el localStorage
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/login']);
  }
  
}
