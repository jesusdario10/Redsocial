import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserModel } from '../../models/userModel';
import { UserServices } from '../../services/user-services.service';
import { containerRefreshStart } from '@angular/core/src/render3/instructions';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title : string;
  user : UserModel;
  status :string;
  identity :any;
  token:string;

  constructor(
    private _user : UserServices,
    private _route:ActivatedRoute,
    private _router : Router
  ) {
    this.title = "Identificate",
    this.user = new UserModel("", "", "", "", "", "", "", "");//8 campos vacios corresponden a las 8n propiedades del modelo
   }

  ngOnInit() {

  }
  //login del usuario
  onSubmit(loginForm){
    this._user.singup(this.user).subscribe(
      response=>{
        this.identity = response.user;
        //persistir datos del usuario
          localStorage.setItem('identity', JSON.stringify(this.identity));
        //conseguir el token
        this.getToken();
      },
      error=>{
        this.status = "error"
      }
    )
  }
  //obtener token del backend
  getToken(){
    this._user.singup(this.user, 'true' ).subscribe(
      response=>{
        this.token = response.token;
        if(this.token.length<=0){
          this.status ='error'
        }else{
          localStorage.setItem('token', JSON.stringify(this.token));
          this.getCounters();
        }
        //persistir el token del usuario
        //conseguir los contadores del usuario es decir seguidos y me siguen
      },
      error=>{
        this.status = "error"
      }
    )
  }
  //obtener las estadisticas de seguidos y seguidores
  getCounters(){
    this._user.getCounters()
      .subscribe((datos:any)=>{
        //guardemos  storage en el localStorage los following, followed y publications
        localStorage.setItem('stats', JSON.stringify(datos));
        this.status = "success";
        console.log(datos);
        this._router.navigate(['/home']);
      })
  }

  
}
