import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../../backendConnection/backend.service';
import { TaskInterface } from '../task.interface';

@Component({
    selector: 'app-add-task',
    template: `
  <h2 class="text-center m-5">Add a New Task</h2>
  <app-task-form (formSubmitted)="addTask($event)"></app-task-form>
`
})
export class AddTaskComponent {
    constructor(
        private router: Router,
        private backendService: BackendService
    ) { }

    addTask(task: TaskInterface) {
        this.backendService.createTask(task)
            .subscribe({
                next: () => {
                    this.router.navigate(['/tasks']);
                },
                error: (error) => {
                    alert("Failed to create task");
                    console.error(error);
                }
            });
    }
}
