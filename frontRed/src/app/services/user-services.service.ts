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
  singup(user, gettoken=null):Observable<any>{
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
  /*getCounters es un servicio que me trae todos los contadores del
   usuario es decir cuantos usuarios lo siguen y a cuantos sigue 
   este metodo recibira un userId que por defecto vendra a null,
   devolvera un observable*/
  getCounters(userId =null){
    let headers = new HttpHeaders().set('Content-Type', 'application/json')//cuando envie el json a la api lo podra procesar
                                   .set('Authorization', this.getToken());//aqui le pasamos en token en los headers para que decodifique
    if(userId != null ){
      return this._http.get(this.url + 'counters/' + userId, {headers:headers}).pipe(
        map((resp)=>{
          console.log(resp);
          return resp;
        })
      );
    }else{
      return this._http.get(this.url + 'counters', {headers:headers}).pipe(
        map((resp:any)=>{
          console.log(resp);
          return resp;
        })
      );
    }
  }
  /*Actualizar usuario*/
  updateUser(user:UserModel):Observable<any>{
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')//cuando envie el json a la api lo podra procesar
                                    .set('Authorization', this.getToken());//aqui le pasamos en token en los headers para que decodifique
    return this._http.put(this.url+'updateuser/'+user._id, params, {headers:headers}).pipe(
      map((resp:any)=>{
        return resp;
      }),
      catchError(err=>{
        console.log(err);
        swal('!Ya Existe la Cuenta', err.error.message, 'error');
        return throwError(err) //nos retornra un observable
      })
     
    )
  }
  

}
