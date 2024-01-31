import { Component, OnInit } from '@angular/core';
import { UserInterface } from '../user.interface';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../backendConnection/backend.service';

@Component({
    selector: 'app-edit-user',
    template: `
   <h2 class="text-center m-5">Edit an User</h2>
   <app-user-form [initialState]="user" (formSubmitted)="editUser($event)"></app-user-form>
 `
})
export class EditUserComponent implements OnInit {
    user: BehaviorSubject<UserInterface> = new BehaviorSubject({});

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private backendService: BackendService,
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            alert('No id provided');
        }

        this.backendService.getUser(id!).subscribe((user) => {
            this.user.next(user);
        });
    }

    editUser(user: UserInterface) {
        this.backendService.updateUser(this.user.value._id || '', user)
            .subscribe({
                next: () => {
                    this.router.navigate(['/users']);
                },
                error: (error) => {
                    alert('Failed to update user');
                    console.error(error);
                }
            })
    }
}
