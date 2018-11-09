import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserModel } from '../../models/userModel';
import { UserServices } from 'src/app/services/user-services.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  public title:string;
  public user:UserModel;
  public identity;
  public token : string;
  public status : string

  constructor(
    private _route:ActivatedRoute,
    private _router : Router,
    private _userService : UserServices
  ) {
    this.title = "Actualizar mis Datos";
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
   }

  ngOnInit() {
    console.log("se cargo bien");
  }
  //Actualizar datos de usuario
  onSubmit(userEditForm)
  {
    this._userService.updateUser(this.user)
      .subscribe((datos:any)=>{
        console.log(datos);
        localStorage.setItem('identity', JSON.stringify(this.user));
        this.identity = this.user;
      })
  }
  

}
