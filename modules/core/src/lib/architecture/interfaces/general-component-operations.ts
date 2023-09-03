import { Observable } from 'rxjs';

export interface GeneralComponentOperations<ID> {
    back(): void;

    delete(id: ID): Observable<void>;

    remove(id: ID): void;

    findOne(id: ID): void;

    findAll(): void;

    observablePopulationOfEntities(): void;

    newEntity(): void;

    edit(id: ID): void;
}
