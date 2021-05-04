import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../user.model';

@Component({
  selector: 'app-user-form-modal',
  templateUrl: './user-form-modal.component.html',
  styleUrls: ['./user-form-modal.component.css']
})
export class UserFormModalComponent implements OnInit {
  @Input() public editUser = new User ();

  constructor ( public ngbActiveModal : NgbActiveModal ) { }

  ngOnInit (): void {
    if ( this.editUser == null ) {
      this.editUser = new User ();
    }
  }

  CloseModal () {
    this.ngbActiveModal.close ();
  }

  Save () {
    this.ngbActiveModal.close ( this.editUser );
  }

}
