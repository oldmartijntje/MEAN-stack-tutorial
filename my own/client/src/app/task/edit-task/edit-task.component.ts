import { Component, OnInit } from '@angular/core';
import { TaskInterface } from '../task.interface';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../backendConnection/backend.service';

@Component({
    selector: 'app-edit-task',
    template: `
   <h2 class="text-center m-5">Edit an Task</h2>
   <app-task-form [initialState]="task" (formSubmitted)="editTask($event)"></app-task-form>
 `
})
export class EditTaskComponent implements OnInit {
    task: BehaviorSubject<TaskInterface> = new BehaviorSubject({});

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

        this.backendService.getTask(id!).subscribe((task) => {
            this.task.next(task);
        });
    }

    editTask(task: TaskInterface) {
        this.backendService.updateTask(this.task.value._id || '', task)
            .subscribe({
                next: () => {
                    this.router.navigate(['/tasks']);
                },
                error: (error) => {
                    alert('Failed to update task');
                    console.error(error);
                }
            })
    }
}
