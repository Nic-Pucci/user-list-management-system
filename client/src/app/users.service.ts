import { Injectable } from '@angular/core';
import { User } from './user.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  databaseServerURL : string = "http://localhost:8080/users";

  constructor ( private http : HttpClient ) { }

  GetUsers () {
    return this.http.get ( this.databaseServerURL ); 
  }

  CreateUser ( user : User ) {
    return this.http.post ( this.databaseServerURL , user ); 
  }

  SaveUser ( user : User ) {
    return this.http.put ( this.databaseServerURL , user ); 
  }

  DeleteUser (  user : User ) {
    let httpParams = new HttpParams ().set ( 'userID', "" + user.id );
    let options = { params: httpParams };
    console.log ( "TRYING HTTP DELETE" );
    return this.http.delete ( this.databaseServerURL + "/" + user.id , options ); 
  }

}
