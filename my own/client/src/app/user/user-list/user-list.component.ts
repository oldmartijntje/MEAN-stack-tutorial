import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { UserInterface } from '../user.interface';
import { BackendService } from '../../backendConnection/backend.service';

@Component({
    selector: 'app-user-list',
    template: `
   <h2 class="text-center m-5">User List</h2>
 
   <table class="table table-striped table-bordered">
       <thead>
           <tr>
               <th>Name</th>
               <th>Access Level</th>
               <th>Action</th>
           </tr>
       </thead>
 
       <tbody>
           <tr *ngFor="let user of users$ | async">
               <td>{{user.name}}</td>
               <td>{{user.accessLevel}}</td>
               <td>
                   <button class="btn btn-primary me-1" [routerLink]="['edit/', user._id]">Edit</button>
                   <button class="btn btn-danger" (click)="deleteUser(user._id || '')">Delete</button>
               </td>
           </tr>
       </tbody>
   </table>
 
   <button class="btn btn-primary mt-3" [routerLink]="['new']">Add a New User</button>
 `,
    styles: ``
})
export class UserListComponent {
    users$: Observable<UserInterface[]> = new Observable();

    constructor(private backendService: BackendService) { }

    ngOnInit(): void {
        this.fetchUsers();
    }

    deleteUser(id: string): void {
        this.backendService.deleteUser(id).subscribe({
            next: () => this.fetchUsers()
        });
    }

    private fetchUsers(): void {
        this.users$ = this.backendService.getUsers();
    }
}
