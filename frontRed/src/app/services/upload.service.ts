import { Injectable } from '@angular/core';

import { Observable, Subject, pipe } from 'rxjs';
import { map, catchError } from "rxjs/operators"; 
import { throwError } from "rxjs/internal/observable/throwError"; 
import swal from 'sweetalert';

import { UserModel } from '../models/userModel';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public url : string;

  constructor(
  ) {
    this.url = GLOBAL.url;
  }

  makeFileRequest(url:string, params: Array<string>, files: Array<File>, token:string, name:string){
    return new Promise(function(resolve, reject){
      var formData : any = new FormData();
      var xhr = new XMLHttpRequest(); //objeto que nos permite hacer peticiones ajax en javascript puro

      for(var i = 0; i< files.length; i++){
        formData.append(name, files[i], files[i].name);
      }
      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          if(xhr.status == 200){
            resolve(JSON.parse(xhr.response));
          }else{
            reject(xhr.response);
          }
        }
      }

      xhr.open('post', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    })
  }
}
