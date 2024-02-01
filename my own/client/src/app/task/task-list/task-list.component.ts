import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { TaskInterface } from '../task.interface';
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
           <tr *ngFor="let task of tasks$ | async">
               <td>{{task.name}}</td>
               <td>{{task.when}}</td>
               <td>{{task.done}}</td>
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
    styles: ``
})
export class TaskListComponent {
    tasks$: Observable<TaskInterface[]> = new Observable();
    user: { [key: string]: BehaviorSubject<UserInterface> } = {};

    constructor(private backendService: BackendService) { }

    ngOnInit(): void {
        this.fetchTasks();
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

    deleteTask(id: string): void {
        this.backendService.deleteTask(id).subscribe({
            next: () => this.fetchTasks()
        });
    }

    private fetchTasks(): void {
        this.tasks$ = this.backendService.getTasks();
    }
}
