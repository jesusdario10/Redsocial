import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserModel } from '../../models/userModel';
import { UserServices } from 'src/app/services/user-services.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  title : string;
  user : UserModel;
  status : string;

  constructor(
    private _route: ActivatedRoute,
    private _router : Router,
    private _user : UserServices
  ) {
    this.title = "Registrate"
    this.user = new UserModel("", "", "", "", "", "", "", "");//8 campos vacios corresponden a las 8n propiedades del modelo
   }


  ngOnInit() {
    
  }
  onSubmit(registerForm){
    this._user.register(this.user)
      .subscribe((datos:any)=>{
        console.log(datos);
        if(datos.user){
          this.status = 'success'
          registerForm.reset();
        }else{
          this.status='false'
        }
      });
  }  

}
