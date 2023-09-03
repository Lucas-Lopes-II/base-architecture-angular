import { GeneralComponentOperations } from './general-component-operations';

export interface GeneralComponentWithFormOperations<T, ID>
    extends GeneralComponentOperations<ID> {
    initForm(): void;

    clearForm(): void;

    save(data?: T): void;

    saveWithLocationBack(data?: T): void;
}
