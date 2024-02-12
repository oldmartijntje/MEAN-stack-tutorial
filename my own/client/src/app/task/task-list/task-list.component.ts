import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';

import { TaskFilterInterface, TaskInterface } from '../task.interface';
import { BackendService } from '../../backendConnection/backend.service';
import { UserInterface } from '../../user/user.interface';

@Component({
    selector: 'app-task-list',
    template: `
   <h2 class="text-center m-5">Task List</h2>
   <button class="btn btn-primary me-1" [routerLink]="'/users'">Go to Users</button>
 
   <table class="table table-striped table-bordered">
       <thead>
           <tr>
               <th>Name</th>
               <th>When</th>
               <th>Done</th>
               <th>Description</th>
               <th>Who</th>
               <th>Action</th>
           </tr>
       </thead>
       <tbody>
           <tr>
               <th><input type="text" [(ngModel)]="filters.name" placeholder="Filter on names"></th>
               <th>
                   <input type="text" [(ngModel)]="filters.when" id="when" placeholder="startdate (YYYY or YYYY-MM-DD)">
                   <input type="text" [(ngModel)]="filters.untillWhen" id="when" placeholder="enddate (YYYY or YYYY-MM-DD)">
                   <label class="form-check-label" for="when">(YYYY or YYYY-MM-DD) timeframe</label>
                </th>
               <th>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="done" id="done-true" value="{{true}}" [(ngModel)]="filters.done">
                        <label class="form-check-label" for="done-true">Jep</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="done" id="done-false" value="{{false}}" [(ngModel)]="filters.done">
                        <label class="form-check-label" for="done-false">Nope</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="done" id="done-any" value="{{undefined}}" [(ngModel)]="filters.done">
                        <label class="form-check-label" for="done-false">Any</label>
                    </div>

                </th>
               <th><input type="text" [(ngModel)]="filters.description" placeholder="Filter on descriptions"></th>
               <th>
                    <select class="form-select" [(ngModel)]="filters.user" name="done">
                        <option *ngFor="let user of userList$ | async" value="{{user._id}}">{{user.accessLevel}} - {{user.name}}</option>
                        <option value=" ">None</option>
                        <option value="">Any</option>
                    </select>
                </th>
               <th>
                <button class="btn btn-primary me-1" (click)="filterTasks()">Filter</button>
                <button class="btn btn-danger" (click)="ignoreFilters()">Remove</button>
            </th>
           </tr>
       </tbody>
 
       <tbody>
           <tr *ngFor="let task of displayedTasks">
               <td>{{task.name}}</td>
               <td>{{calculateDate(task.when)}}: {{task.when}}</td>
               <td>{{isItDone(task.done)}}</td>
               <td>{{task.description}}</td>
               <td>{{getUserName(task.user)}}</td>
               <td>
                   <button class="btn btn-primary me-1" [routerLink]="['edit/', task._id]">Edit</button>
                   <button class="btn btn-danger" (click)="deleteTask(task._id || '')">Delete</button>
               </td>
           </tr>
       </tbody>
   </table>
 
   <button class="btn btn-primary mt-3" [routerLink]="['new']">Add a New Task</button>
 `,
    styles: `th>input { width: 100%; }`
})
export class TaskListComponent implements OnInit {
    tasks$: Observable<TaskInterface[]> = new Observable();
    user: { [key: string]: BehaviorSubject<UserInterface> } = {};
    userList$: Observable<UserInterface[]> = new Observable();

    filters: TaskFilterInterface = {};
    currentTasks: TaskInterface[] = [];
    filteredTasks: TaskInterface[] = [];
    filtered: boolean = false;

    displayedTasks: TaskInterface[] = [];

    constructor(private backendService: BackendService) { }

    ngOnInit(): void {
        this.fetchTasks();
        this.fetchUsers();
        this.tasks$.subscribe({
            next: (tasks: TaskInterface[]) => {
                this.currentTasks = tasks;
                if (!this.filtered) {
                    this.displayedTasks = this.currentTasks;
                }
            }
        });
    }

    filterTasks(): void {
        var sendingFilters = { ...this.filters };
        if (typeof sendingFilters.done === 'string' && sendingFilters.done === 'true') {
            sendingFilters.done = true;
        } else if (typeof sendingFilters.done === 'string' && sendingFilters.done === 'false') {
            sendingFilters.done = false;
        } else {
            delete sendingFilters.done;
        }

        this.backendService.getTasksFiltered(sendingFilters).pipe(
            take(1)
        ).subscribe({
            next: (tasks: TaskInterface[]) => {
                this.filteredTasks = tasks;
                this.displayedTasks = tasks;
                this.filtered = true;
            }
        });
    }

    private fetchUsers(): void {
        this.userList$ = this.backendService.getUsers();
    }

    ignoreFilters(): void {
        this.filtered = false;
        this.displayedTasks = this.currentTasks;
    }

    getUserName(id: string | undefined): string {
        if (!id || id == ' ') {
            return '';
        }
        if (!this.user[id]) {
            this.user[id] = new BehaviorSubject<UserInterface>({});
            this.backendService.getUser(id).subscribe({
                next: (user: UserInterface) => {
                    this.user[id].next(user);
                },
                error: (error: any) => {
                    if (error.status == 404) {
                        this.user[id].next({ name: 'User not found' });
                    } else {
                        console.error('An error occurred:', error);
                    }
                }
            });
        }
        return this.user[id].value.name || '';
    }

    calculateDate(date: Date | undefined): string {
        if (!date) {
            return 'No date';
        }
        // how to strip the hours and minutes from the date
        date = new Date(date);
        date.setHours(0, 0, 0, 0);
        const today: Date = new Date();
        today.setHours(0, 0, 0, 0);
        const dateToCheck: Date = new Date(date);
        const timeDifference: number = dateToCheck.getTime() - today.getTime();
        const daysDifference: number = timeDifference / (1000 * 3600 * 24);
        if (daysDifference < 0) {
            if (daysDifference == -1) {
                return 'Yesterday';
            }
            return `${Math.abs(daysDifference)} days ago`;
        }
        if (daysDifference == 0) {
            return 'Today';
        }
        if (daysDifference == 1) {
            return 'Tomorrow';
        }
        return `In ${daysDifference} days`;
    }

    isItDone(done: boolean | undefined): string {
        if (typeof done === 'boolean' && done === true || typeof done === 'string' && done === 'true') {
            return 'It\'s done!';
        }
        return 'It\'s not done!';
    }

    deleteTask(id: string): void {
        this.backendService.deleteTask(id).subscribe({
            next: () => this.fetchTasks()
        });
    }

    private fetchTasks(): void {
        this.tasks$ = this.backendService.getTasks();
    }
}
