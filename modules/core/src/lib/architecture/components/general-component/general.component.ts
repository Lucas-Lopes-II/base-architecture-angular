/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injector } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Entity } from '../../interfaces/entity';
import { EntityId } from '../../types/entity-id';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CrudService } from '../../services/crud.service';
import { GeneralComponentOperations } from '../../interfaces/general-component-operations';

export abstract class GeneralComponent<
  T extends Entity,
  ID extends EntityId,
  _Service extends CrudService<T, ID>,
> implements GeneralComponentOperations<ID>
{
  protected route: ActivatedRoute;
  protected router: Router;
  protected location: Location;
  protected entity!: T;
  protected entities!: T[];
  protected entities$!: Observable<T[]>;
  protected entityName!: string;
  protected unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    protected injector: Injector,
    protected service: _Service,
    entityName: string,
  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.location = this.injector.get(Location);
    this.entityName = entityName;
  }

  public back(): void {
    this.location.back();
  }

  public delete(id: ID): Observable<void> {
    return this.service.delete(id).pipe(takeUntil(this.unsubscribeAll));
  }

  public remove(id: ID): void {
    this.delete(id).subscribe({
      next: (_) => {
        this.entities = this.entities.filter((e) => e.id !== id);
      },
      error: (error: HttpErrorResponse) => {
        // Tratamento de erro
      },
    });
  }

  public findOne(id: ID): void {
    this.service
      .findOne(id)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe({
        next: (response: T) => {
          this.entity = response;
        },
        error: (error: HttpErrorResponse) => {
          // Tratamento de erro
        },
      });
  }

  public findAll(): void {
    this.service
      .findAll()
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe({
        next: (response: T[]) => {
          this.entities = response;
        },
        error: (error: HttpErrorResponse) => {
          // Tratamento de erro
        },
      });
  }

  public observablePopulationOfEntities(): void {
    this.entities$ = this.service.findAll();
  }

  public newEntity(): void {
    this.router.navigate(['new'], { relativeTo: this.route.parent });
  }

  public edit(id: ID): void {
    this.router.navigate(['edit', id], { relativeTo: this.route.parent });
  }
}
