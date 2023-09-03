import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';

import { Observable } from 'rxjs';
import { CrudServiceOperations } from '../interfaces/crud-service-operations';
import { EntityId } from '../types/entity-id';

export abstract class CrudService<T, ID extends EntityId>
    implements CrudServiceOperations<T, ID>
{
    protected http: HttpClient;

    constructor(
        protected injector: Injector,
        protected baseUrl: string,
    ) {
        this.http = this.injector.get(HttpClient);
    }

    public save(entity: T): Observable<T> {
        return this.http.post<T>(this.baseUrl, entity);
    }

    public update(id: ID, entity: T): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}/${id}`, entity);
    }

    public findOne(id: ID): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}/${id}`);
    }

    public findAll(): Observable<T[]> {
        return this.http.get<T[]>(this.baseUrl);
    }

    public delete(id: ID): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${id}`);
    }
}
