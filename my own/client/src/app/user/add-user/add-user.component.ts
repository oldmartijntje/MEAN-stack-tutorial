import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../backendConnection/backend.service';
import { UserInterface } from '../user.interface';

@Component({
    selector: 'app-add-user',
    template: `
  <h2 class="text-center m-5">Add a New User</h2>
  <app-user-form (formSubmitted)="addUser($event)"></app-user-form>
`
})
export class AddUserComponent {
    constructor(
        private router: Router,
        private backendService: BackendService
    ) { }

    addUser(user: UserInterface) {
        this.backendService.createUser(user)
            .subscribe({
                next: () => {
                    this.router.navigate(['/users']);
                },
                error: (error) => {
                    alert("Failed to create user");
                    console.error(error);
                }
            });
    }
}
