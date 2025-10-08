export type CrudOperation<T> = {
  type: 'create' | 'update' | 'delete';
  payload: T;
};
