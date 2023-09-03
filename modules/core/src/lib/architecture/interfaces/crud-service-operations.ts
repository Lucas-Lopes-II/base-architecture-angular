/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';

export interface CrudServiceOperations<T, ID> {
  save(t: T): Observable<T>;
  update(id: ID, t: T): Observable<T>;
  findOne(id: ID): Observable<T>;
  findAll(): Observable<T[]>;
  delete(id: ID): Observable<any>;
}
