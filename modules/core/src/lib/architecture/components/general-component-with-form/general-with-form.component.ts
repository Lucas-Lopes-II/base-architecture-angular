import { Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { takeUntil } from 'rxjs';
import { EntityId } from '../../types/entity-id';
import { Entity } from '../../interfaces/entity';
import { CrudService } from '../../services/crud.service';
import { GeneralComponent } from '../general-component/general.component';
import { GeneralComponentWithFormOperations } from '../../interfaces/general-component-with-form-operations';

export abstract class GeneralWithFormComponent<
    T extends Entity,
    ID extends EntityId,
    _Service extends CrudService<T, ID>,
>
    extends GeneralComponent<T, ID, _Service>
    implements GeneralComponentWithFormOperations<T, ID>
{
    protected form!: FormGroup;
    protected formBuilder!: FormBuilder;

    constructor(
        injector: Injector,
        service: _Service,
        entityName: string,
    ) {
        super(injector, service, entityName);
        this.formBuilder = this.injector.get(FormBuilder);
    }

    abstract initForm(): void;

    public clearForm(): void {
        this.form?.reset();
        this.initForm();
    }

    public save(data: T = this.form?.value): void {
        if (this.form?.invalid) return; // Menssagem de erro se houver

        this.onSubmit(data);
    }

    public saveWithLocationBack(data: T = this.form?.value): void {
        if (this.form?.invalid) return; // Menssagem de erro se houver

        this.onSubmitWithLocationBack(data);
    }

    public onSubmit(data: T = this.form?.value): void {
        if (this.form?.invalid) return; // Menssagem de erro se houver

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

    public onSubmitWithLocationBack(data: T = this.form?.value): void {
        if (this.form?.invalid) return; // Menssagem de erro se houver

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
