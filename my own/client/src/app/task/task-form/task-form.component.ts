import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TaskInterface } from '../../task/task.interface';

@Component({
    selector: 'app-task-form',
    template: `
   <form class="task-form" autocomplete="off" [formGroup]="taskForm" (ngSubmit)="submitForm()">
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
       <input class="form-control" type="text" formControlName="position" placeholder="Position" required>
       <label for="position">Position</label>
     </div>
 
     <div *ngIf="description.invalid && (description.dirty || description.touched)" class="alert alert-danger">
 
       <div *ngIf="description.errors?.['required']">
         Position is required.
       </div>
       <div *ngIf="description.errors?.['minlength']">
         Position must be at least 5 characters long.
       </div>
     </div>
 
     <div class="mb-3">
       <div class="form-check">
         <input class="form-check-input" type="checkbox" formControlName="done" name="done" id="done">
         <label class="form-check-label" for="done">Done</label>
       </div>
     </div>
 
     <button class="btn btn-primary" type="submit" [disabled]="taskForm.invalid">Add</button>
   </form>
 `,
    styles: [
        `.taskForm-form {
     max-width: 560px;
     margin-left: auto;
     margin-right: auto;
   }`
    ]
})
export class TaskFormComponent implements OnInit {
    @Input()
    initialState: BehaviorSubject<TaskInterface> = new BehaviorSubject({});

    @Output()
    formValuesChanged = new EventEmitter<TaskInterface>();

    @Output()
    formSubmitted = new EventEmitter<TaskInterface>();

    taskForm: FormGroup = new FormGroup({});

    constructor(private fb: FormBuilder) { }

    get name() { return this.taskForm.get('name')!; }
    get description() { return this.taskForm.get('description')!; }
    get when() { return this.taskForm.get('when')!; }
    get done() { return this.taskForm.get('done')!; }
    get user() { return this.taskForm.get('user')!; }

    // when and user are not defined in the html form yet

    ngOnInit() {
        this.initialState.subscribe(task => {
            this.taskForm = this.fb.group({
                name: [task.name, [Validators.required]],
                description: [task.description, [Validators.minLength(5)]],
                when: [task.when, [Validators.required]],
                done: [task.done, [Validators.required]],
                user: [task.user, []],
            });
        });

        this.taskForm.valueChanges.subscribe((val) => { this.formValuesChanged.emit(val); });
    }

    submitForm() {
        this.formSubmitted.emit(this.taskForm.value);
    }
}