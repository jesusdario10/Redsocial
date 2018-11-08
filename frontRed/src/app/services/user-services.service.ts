import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable, Subject, pipe } from 'rxjs';
import { map, catchError } from "rxjs/operators"; 
import { throwError } from "rxjs/internal/observable/throwError"; 
import swal from 'sweetalert';



import { UserModel } from '../models/userModel';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class UserServices {
  public url : string;
  public identity;
  public token;

  constructor(
    public _http : HttpClient
  ){
    this.url = GLOBAL.url;
  }
  //registro de usuario
  register(user:UserModel):Observable<any>{
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');//cuando envie el json a la api lo podra procesar

    return this._http.post(this.url+'register', params, {headers:headers}).pipe(
      map((resp:any)=>{
        return resp;
      })
    );
  }
  //login
  singup(user:UserModel, gettoken=null):Observable<any>{
    if(gettoken !=null){
      user.gettoken = gettoken;
    }
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');//cuando envie el json a la api lo podra procesar
    return this._http.post(this.url+'login', params, {headers:headers}).pipe(
      map((resp:any)=>{
        return resp;
      }),
      catchError(err=>{
        console.log(err);
        swal('!Ya Existe la Cuenta', err.error.message, 'error');
        return throwError(err) //nos retornra un observable
      })
    );
  }
  //convierte el json string del localstrorage del user en un json
  getIdentity(){
    let identity = JSON.parse(localStorage.getItem('identity'));

    if(identity != undefined){
      this.identity = identity;
    }else{
      this.identity = null;
    }
    return this.identity;
  }
  //convierte el json string del localstrorage del token en un json
  getToken(){
    let token =  JSON.parse(localStorage.getItem('token'));

    if(token != undefined){
      this.token = token;
    }else{
      this.token = null;
    }
    return this.token;
  }

}
