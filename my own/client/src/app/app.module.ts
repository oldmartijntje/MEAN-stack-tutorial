import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskListComponent } from './task/task-list/task-list.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { TaskFormComponent } from './task/task-form/task-form.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddUserComponent } from './user/add-user/add-user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';

@NgModule({
    declarations: [
        AppComponent,
        TaskListComponent,
        UserListComponent,
        TaskFormComponent,
        UserFormComponent,
        AddUserComponent,
        EditUserComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        RouterModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
