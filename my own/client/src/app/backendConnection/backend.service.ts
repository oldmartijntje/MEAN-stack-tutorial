import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskInterface } from '../task/task.interface';
import { Observable, Subject } from 'rxjs';
import { UserInterface } from '../user/user.interface';

@Injectable({
    providedIn: 'root'
})
export class BackendService {
    private url = 'http://localhost:5200';
    private Tasks$: Subject<TaskInterface[]> = new Subject();
    private Users$: Subject<UserInterface[]> = new Subject();

    constructor(private httpClient: HttpClient) { }

    private refreshTasks() {
        this.httpClient.get<TaskInterface[]>(`${this.url}/tasks`)
            .subscribe(Tasks => {
                this.Tasks$.next(Tasks);
            });
    }

    getTasks(): Subject<TaskInterface[]> {
        this.refreshTasks();
        return this.Tasks$;
    }

    getTask(id: string): Observable<TaskInterface> {
        return this.httpClient.get<TaskInterface>(`${this.url}/tasks/${id}`);
    }

    createTask(task: TaskInterface): Observable<string> {
        return this.httpClient.post(`${this.url}/tasks`, task, { responseType: 'text' });
    }

    updateTask(id: string, task: TaskInterface): Observable<string> {
        return this.httpClient.put(`${this.url}/tasks/${id}`, task, { responseType: 'text' });
    }

    deleteTask(id: string): Observable<string> {
        return this.httpClient.delete(`${this.url}/tasks/${id}`, { responseType: 'text' });
    }

    private refreshUsers() {
        this.httpClient.get<TaskInterface[]>(`${this.url}/users`)
            .subscribe(Users => {
                this.Users$.next(Users);
            });
    }

    getUsers(): Subject<UserInterface[]> {
        this.refreshUsers();
        return this.Users$;
    }

    getUser(id: string): Observable<UserInterface> {
        return this.httpClient.get<UserInterface>(`${this.url}/users/${id}`);
    }

    createUser(task: UserInterface): Observable<string> {
        return this.httpClient.post(`${this.url}/users`, task, { responseType: 'text' });
    }

    updateUser(id: string, task: UserInterface): Observable<string> {
        return this.httpClient.put(`${this.url}/users/${id}`, task, { responseType: 'text' });
    }

    deleteUser(id: string): Observable<string> {
        return this.httpClient.delete(`${this.url}/users/${id}`, { responseType: 'text' });
    }
}
