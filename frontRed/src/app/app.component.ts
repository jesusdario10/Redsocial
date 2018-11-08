import { Component, OnInit, DoCheck } from '@angular/core';
import { UserServices } from './services/user-services.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
  title = 'NGSOCIAL';
  public identity:any = null;
 

  constructor(
   private _userService: UserServices
  ){
  }
  ngOnInit(){
    this.identity = this._userService.getIdentity();
  }
  ngDoCheck(){
    this.identity = this._userService.getIdentity();
  }

  
}
