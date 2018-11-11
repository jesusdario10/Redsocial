import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserModel } from '../../models/userModel';
import { UserServices } from 'src/app/services/user-services.service';

import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public title:string;
  public user:UserModel;
  public identity;
  public token : string;

  constructor(
    private _route:ActivatedRoute,
    private _router : Router,
    private _userService : UserServices,
  ) {
    this.title = "Gente";
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
   }

  ngOnInit() {
    console.log("se cargooooooo");
  }

}
