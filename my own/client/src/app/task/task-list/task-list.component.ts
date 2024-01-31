import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { TaskInterface } from '../task.interface';
import { BackendService } from '../../backendConnection/backend.service';

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
               <td>{{task.user}}</td>
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

    constructor(private backendService: BackendService) { }

    ngOnInit(): void {
        this.fetchTasks();
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
