import { ErrorResponseType } from './error-response.type';

export interface BulkOperationResponseProps<A> {
  createdSuccess: number;
  updatedSuccess: number;
  errorCount: number;
  errors: ErrorResponseType<A>[] | null;
}

/**
 * Most of our response objects will have properties like
 * id, createdAt and updatedAt so we can move them to a
 * separate class and extend it to avoid duplication.
 */
export class BulkOperationResponseBase<A> {
  constructor(props: BulkOperationResponseProps<A>) {
    this.createdSuccess = props.createdSuccess;
    this.updatedSuccess = props.updatedSuccess;
    this.errorCount = props.errorCount;
    this.errors = props.errors;
  }

  createdSuccess: number;
  updatedSuccess: number;
  errorCount: number;
  errors: ErrorResponseType<A>[] | null;
}
