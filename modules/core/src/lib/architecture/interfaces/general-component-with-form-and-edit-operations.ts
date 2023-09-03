import { GeneralComponentWithFormOperations } from './general-component-with-form-operations';

export interface GeneralComponentWithFormAndEditOperations<T, ID>
    extends GeneralComponentWithFormOperations<T, ID> {
    loadForm(): void;
}
