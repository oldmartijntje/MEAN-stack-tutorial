import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task/task-list/task-list.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { AddTaskComponent } from './task/add-task/add-task.component';
import { EditTaskComponent } from './task/edit-task/edit-task.component';

const routes: Routes = [
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    { path: 'tasks', component: TaskListComponent },
    { path: 'tasks/new', component: AddTaskComponent },
    { path: 'tasks/edit/:id', component: EditTaskComponent },
    { path: 'users', component: UserListComponent },
    { path: 'users/new', component: AddUserComponent },
    { path: 'users/edit/:id', component: EditUserComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
