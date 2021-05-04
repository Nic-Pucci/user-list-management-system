import { Component , DebugElement , ViewChild, Input } from '@angular/core';
import { UsersService } from './users.service';
import { User } from './user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserFormModalComponent } from './user-form-modal/user-form-modal.component';

enum SortOption {
  none = 0 ,
  idSortAsc = 1 ,
  idSortDesc = 2 ,
  nameSortAsc = 3 ,
  nameSortDesc = 4 ,
  emailSortAsc = 5 ,
  emailSortDesc = 6 ,
  ageSortAsc = 7 ,
  ageSortDesc = 8
};

@Component ( {
  selector: 'app-root' ,
  templateUrl: './app.component.html' ,
  styleUrls: [ './app.component.css' ] ,
  providers: [ UsersService ]
} )

export class AppComponent {
  constructor ( 
    private usersService: UsersService ,
    private modalService: NgbModal 
  ) {}

  title = 'User List Management System';
  userList: User [];

  averageAge = 0;

  idSortAsc = true;
  nameSortAsc = true;
  emailSortAsc = true;
  ageSortAsc = true;

  selectedSortOption : SortOption = SortOption.none;
  SortOption = SortOption;

  ngOnInit () {
    console.log ( "requested" );
    this.UpdateUserList ();
  }

  UpdateUserList () {
    return this.usersService.GetUsers ().subscribe ( 
      ( data ) => { 
        console.log ( "data = " + data ); 
        this.userList = data as User []; 
        this.UpdateAverageAge ();
      } ,
      ( error ) => { console.error ( error ) } ,
      () => {}
  ) }

  AddUser ( name , email , age ) {
    var user = new User ();
    user.name = name;
    user.email = email;
    user.age = age;

    return this.usersService.CreateUser ( user ).subscribe ( 
      ( data ) => { 
        console.log ( "data = " + ( data as User ).id );
        this.UpdateUserList (); 
      } ,
      ( error ) => { console.error ( error ) } ,
  ) }

  SaveEditedUser ( user ) {
    return this.usersService.SaveUser ( user ).subscribe ( 
      ( data ) => { 
        console.log ( "data = " + ( data as User ).id );
        this.UpdateUserList ();
      } ,
      ( error ) => { console.error ( error ) } ,
  ) }

  CreateNewUser () {
    this.OpenUserFormModal ( null ); 
  }

  EditUser ( userIndex ) {
    console.log ( "Edit userIndex = " + userIndex );
    var editUser = this.userList [ userIndex ];
    this.OpenUserFormModal ( editUser );
  }

  DeleteUser ( userIndex ) {
    console.log ( "Delete userIndex = " + userIndex );
    var deleteUser = this.userList [ userIndex ];
    return this.usersService.DeleteUser ( deleteUser ).subscribe ( 
      ( data ) => { 
        console.log ( "data = " + ( data as number ) );
        this.UpdateUserList ();
      } ,
      ( error ) => { console.error ( error ) } ,
  ) }

  OpenUserFormModal ( editUser? ) {
    const modalRef = this.modalService.open ( UserFormModalComponent );
    if ( editUser != null ) 
    {
      var user = new User ();
      user.id = editUser.id;
      user.name = editUser.name;
      user.email = editUser.email;
      user.age = editUser.age;

      modalRef.componentInstance.editUser = user;
    }
    
    modalRef.result.then ( ( result ) => {
      if ( result == null ) 
      {
        return;
      }
      if ( result.id == -1 ) 
      {
        console.log ( "ADDING NEW ... = " + result.name + " , " + result.email + " , " + result.age );
        this.AddUser ( result.name , result.email , result.age );
      }
      else 
      {
        console.log ( "SAVING ... = " + result.name + " , " + result.email + " , " + result.age );
        this.SaveEditedUser ( result );
      }
      
    } ).catch ( ( error ) => {
      console.log ( error );
    } );
  }

  UpdateAverageAge () 
  {
    if ( this.userList.length == 0 ) {
      return 0.0;
    }
  
    var ageTotal = 0.0;
    for ( var i = 0 ; i < this.userList.length ; i++ ) {
      var userAge = this.userList [ i ].age;
      ageTotal += userAge;
    }
  
    this.averageAge = ageTotal / this.userList.length;
  }

  idSortAscenComparator ( a , b ) 
  {
    return String ( a.id ).localeCompare ( String ( b.id ) );
  }

  idSortDescComparator ( a , b ) 
  {
    return String ( b.id ).localeCompare ( String ( a.id ) );
  }

  nameSortAscenComparator ( a , b ) 
  {
    return String ( a.name ).localeCompare ( String ( b.name ) );
  }
  
  nameSortDescComparator ( a , b ) 
  {
    return String ( b.name ).localeCompare ( String ( a.name ) );
  }
  
  emailSortAscenComparator ( a , b ) 
  {
    return String ( a.email ).localeCompare ( String ( b.email ) );
  }
  
  emailSortDescComparator ( a , b ) 
  {
    return String ( b.email ).localeCompare ( String ( a.email ) );
  }
  
  ageSortAscenComparator ( a , b ) 
  {
    return a.age - b.age;
  }
  
  ageSortDescComparator ( a , b ) 
  {
    return b.age - a.age;
  }

  SortByID () 
  {
    if ( this.selectedSortOption == SortOption.idSortAsc ) 
    {
      this.userList.sort ( this.idSortAscenComparator );
      this.selectedSortOption = SortOption.idSortDesc;
    }
    else 
    {
      this.userList.sort ( this.idSortDescComparator );
      this.selectedSortOption = SortOption.idSortAsc;
    }
  }

  SortByName () 
  {
    if ( this.selectedSortOption == SortOption.nameSortAsc ) 
    {
      this.userList.sort ( this.nameSortAscenComparator );
      this.selectedSortOption = SortOption.nameSortDesc;
    }
    else 
    {
      this.userList.sort ( this.nameSortDescComparator );
      this.selectedSortOption = SortOption.nameSortAsc;
    }
  }
  
  SortByEmail () {
    if ( this.selectedSortOption == SortOption.emailSortAsc ) 
    {
      this.userList.sort ( this.emailSortAscenComparator );
      this.selectedSortOption = SortOption.emailSortDesc;
    }
    else 
    {
      this.userList.sort ( this.emailSortDescComparator );
      this.selectedSortOption = SortOption.emailSortAsc;
    }
  }
  
  SortByAge () {
    if ( this.selectedSortOption == SortOption.ageSortAsc ) 
    {
      this.userList.sort ( this.ageSortAscenComparator );
      this.selectedSortOption = SortOption.ageSortDesc;
    }
    else 
    {
      this.userList.sort ( this.ageSortDescComparator );
      this.selectedSortOption = SortOption.ageSortAsc;
    }

    this.ageSortAsc = !this.ageSortAsc;
  }
}


