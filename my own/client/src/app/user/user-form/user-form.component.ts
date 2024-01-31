import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { UserInterface } from '../user.interface';

@Component({
    selector: 'app-user-form',
    template: `
   <form class="user-form" autocomplete="off" [formGroup]="userForm" (ngSubmit)="submitForm()">
     <div class="form-floating mb-3">
       <input class="form-control" type="text" id="name" formControlName="name" placeholder="Name" required>
       <label for="name">Name</label>
     </div>
 
     <div *ngIf="name.invalid && (name.dirty || name.touched)" class="alert alert-danger">
       <div *ngIf="name.errors?.['required']">
         Name is required.
       </div>
       <div *ngIf="name.errors?.['minlength']">
         Name must be at least 3 characters long.
       </div>
     </div>
 
     <div class="form-floating mb-3">
       <input class="form-control" type="text" formControlName="accessLevel" placeholder="AccessLevel" required>
       <label for="accessLevel">AccessLevel</label>
     </div>
 
     <div *ngIf="accessLevel.invalid && (accessLevel.dirty || accessLevel.touched)" class="alert alert-danger">
 
       <div *ngIf="accessLevel.errors?.['required']">
       AccessLevel is required.
       </div>
       <div *ngIf="accessLevel.errors?.['minlength']">
       AccessLevel must be at least 5 characters long.
       </div>
     </div>
 
     <button class="btn btn-primary me-1" type="submit" [disabled]="userForm.invalid">Add</button>
     <button class="btn btn-danger" type="submit" [routerLink]="'/users'">Cancel</button>

   </form>
 `,
    styles: [
        `.user-form {
     max-width: 560px;
     margin-left: auto;
     margin-right: auto;
   }`
    ]
})
export class UserFormComponent implements OnInit {
    @Input()
    initialState: BehaviorSubject<UserInterface> = new BehaviorSubject({});

    @Output()
    formValuesChanged = new EventEmitter<UserInterface>();

    @Output()
    formSubmitted = new EventEmitter<UserInterface>();

    userForm: FormGroup = new FormGroup({});

    constructor(private fb: FormBuilder) { }

    get name() { return this.userForm.get('name')!; }
    get accessLevel() { return this.userForm.get('accessLevel')!; }

    ngOnInit() {
        this.initialState.subscribe(user => {
            this.userForm = this.fb.group({
                name: [user.name, [Validators.required]],
                accessLevel: [user.accessLevel, [Validators.required]]
            });
        });

        this.userForm.valueChanges.subscribe((val) => { this.formValuesChanged.emit(val); });
    }

    submitForm() {
        this.formSubmitted.emit(this.userForm.value);
    }
}
