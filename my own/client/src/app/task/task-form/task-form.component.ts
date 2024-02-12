import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { TaskInterface } from '../../task/task.interface';
import { UserInterface } from '../../user/user.interface';
import { BackendService } from '../../backendConnection/backend.service';

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
            <input class="form-control" type="text" formControlName="description" placeholder="Description" required>
            <label for="position">Description</label>
        </div>
 
        <div *ngIf="description.invalid && (description.dirty || description.touched)" class="alert alert-danger">
    
            <div *ngIf="description.errors?.['required']">
                Description is required.
            </div>
            <div *ngIf="description.errors?.['minlength']">
            Description must be at least 5 characters long.
            </div>
        </div>

        <div class="form-floating mb-3">
            <input
                class="form-control"
                type="date"
                id="when"
                name="when"
                required
                formControlName="when"
            />
            <label for="when">Date</label>
        </div>

        <div *ngIf="when.invalid && (when.dirty || when.touched)" class="alert alert-danger">
            <div *ngIf="when.errors?.['required']">
                Date is required.
            </div>
        </div>
    
 
        <div class="mb-3">
            <label for="done">Done?</label>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" formControlName="done" name="done" id="done-checkbox" value="true">
                <label class="form-check-label" for="done-checkbox">Done</label>
            </div>
        </div>
        <div class="mb-3">
            <label for="user">User:</label>
            <div class="form-check" *ngFor="let user of users$ | async">
                <input class="form-check-input" type="radio" formControlName="user" name="user" id="user-{{user._id}}" value="{{user._id}}" required>
                <label class="form-check-label" for="user-{{user._id}}">{{user.name}} - {{user.accessLevel}}</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" formControlName="user" name="user" id="user-false" value="{{' '}}">
                <label class="form-check-label" for="user-false">Nope</label>
            </div>
        </div>
 
        <button class="btn btn-primary me-1" type="submit" [disabled]="taskForm.invalid">Add</button>
        <button class="btn btn-danger" type="submit" [routerLink]="'/tasks'">Cancel</button>

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
    users$: Observable<UserInterface[]> = new Observable();

    @Input()
    initialState: BehaviorSubject<TaskInterface> = new BehaviorSubject({});

    @Output()
    formValuesChanged = new EventEmitter<TaskInterface>();

    @Output()
    formSubmitted = new EventEmitter<TaskInterface>();

    taskForm: FormGroup = new FormGroup({});

    constructor(private fb: FormBuilder,
        private backendService: BackendService) { }

    get name() { return this.taskForm.get('name')!; }
    get description() { return this.taskForm.get('description')!; }
    get when() { return this.taskForm.get('when')!; }
    get done() { return this.taskForm.get('done')!; }
    get user() { return this.taskForm.get('user')!; }

    // user are not defined in the html form yet

    ngOnInit() {
        this.fetchUsers();
        this.initialState.subscribe(task => {
            if (task.user === undefined) {
                task.user = ' ';
            }
            this.taskForm = this.fb.group({
                name: [task.name, [Validators.required]],
                description: [task.description, []],
                when: [task.when, [Validators.required]],
                done: [task.done, []],
                user: [task.user, []],
            });
        });
        this.taskForm.valueChanges.subscribe((val) => { this.formValuesChanged.emit(val); });
    }

    private fetchUsers(): void {
        this.users$ = this.backendService.getUsers();
    }

    submitForm() {
        if (typeof this.taskForm.value.done === 'string' && this.taskForm.value.done === 'true') {
            this.taskForm.value.done = true;
        } else if (typeof this.taskForm.value.done === 'string' && this.taskForm.value.done === 'false') {
            this.taskForm.value.done = false;
        }

        this.formSubmitted.emit(this.taskForm.value);
    }
}