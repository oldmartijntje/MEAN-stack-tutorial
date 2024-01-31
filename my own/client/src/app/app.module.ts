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

@NgModule({
    declarations: [
        AppComponent,
        TaskListComponent,
        UserListComponent,
        TaskFormComponent,
        UserFormComponent
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
