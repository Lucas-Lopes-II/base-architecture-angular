import { Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { takeUntil } from 'rxjs';
import { EntityId } from '../../types/entity-id';
import { Entity } from '../../interfaces/entity';
import { CrudService } from '../../services/crud.service';
import { GeneralWithFormComponent } from '../general-component-with-form/general-with-form.component';
import { GeneralComponentWithFormAndEditOperations } from '../../interfaces/general-component-with-form-and-edit-operations';

export abstract class GeneralWithFormAndEditComponent<
    T extends Entity,
    ID extends EntityId,
    _Service extends CrudService<T, ID>,
  >
  extends GeneralWithFormComponent<T, ID, _Service>
  implements GeneralComponentWithFormAndEditOperations<T, ID>
{
  protected id!: ID;

  constructor(injector: Injector, service: _Service, entityName: string) {
    super(injector, service, entityName);
    this.id = this.route.snapshot.params['id'];
  }

  abstract loadForm(): void;

  abstract override initForm(): void;

  public override findOne(id: ID): void {
    this.service
      .findOne(id)
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe({
        next: (response: T) => {
          this.entity = response;
          this.loadForm();
        },
        error: (err: HttpErrorResponse) => {
          // Tratamento de erro
        },
      });
  }

  public override onSubmit(data: T = this.form?.value): void {
    if (this.form?.invalid) return; // Menssagem de erro se houver

    if (this.id) {
      this.service
        .update(this.id, data)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe({
          next: (response: T) => {
            this.entity = response;
            this.clearForm();
          },
          error: (err: HttpErrorResponse) => {
            // Tratamento de erro
          },
        });
    } else {
      this.service
        .save(data)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe({
          next: (response: T) => {
            this.entity = response;
          },
          error: (err: HttpErrorResponse) => {
            // Tratamento de erro
          },
        });
    }
  }

  public override onSubmitWithLocationBack(data: T = this.form?.value): void {
    if (this.form?.invalid) return; // Menssagem de erro se houver

    if (this.id) {
      this.service
        .update(this.entity.id as ID, data)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe({
          next: (response: T) => {
            this.location.back();
          },
          error: (err: HttpErrorResponse) => {
            // Tratamento de erro
          },
        });
    } else {
      this.service
        .save(data)
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe({
          next: (response: T) => {
            this.location.back();
          },
          error: (err: HttpErrorResponse) => {
            // Tratamento de erro
          },
        });
    }
  }
}
