import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserModel } from '../../models/userModel';
import { UserServices } from 'src/app/services/user-services.service';
import { UploadService } from 'src/app/services/upload.service';

import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, DoCheck {
  public title:string;
  public user:UserModel;
  public identity;
  public token : string;
  public status : string
  public filesToUpload: Array<File>;
  public url : string;

  constructor(
    private _route:ActivatedRoute,
    private _router : Router,
    private _userService : UserServices,
    private _uploadService : UploadService
  ) {
    this.title = "Actualizar mis Datos";
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
    this.status ='false';
    this.url = GLOBAL.url
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
        this.status = 'success';
        //subida de archivos
        this._uploadService.makeFileRequest(this.url+'uploadimage/'+this.user._id, [], this.filesToUpload, this.token, 'image')
                           .then((result:any)=>{
                            console.log(result);
                            this.user.image = result.user.image;
                            localStorage.setItem('identity', JSON.stringify(this.user));
                           });
        this.ngDoCheck();
      });
  }
  ngDoCheck(){
    this.identity = this.user;
  }
  
  //subir avatar
  fileChangeEvent(fileInput:any){
    this.filesToUpload = <Array<File>>fileInput.target.files;//aqui encontrare todos los ficheros que voyt a subir
    console.log(this.filesToUpload);
  }
  

}
