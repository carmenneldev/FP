import { createAction, props } from '@ngrx/store';
import { Customer } from '../../models/customer.model';

// Load Clients
export const loadClients = createAction('[Client] Load Clients');
export const loadClientsSuccess = createAction(
  '[Client] Load Clients Success',
  props<{ clients: Customer[] }>()
);
export const loadClientsFailure = createAction(
  '[Client] Load Clients Failure',
  props<{ error: string }>()
);

// Add Client
export const addClient = createAction(
  '[Client] Add Client',
  props<{ client: Customer }>()
);
export const addClientSuccess = createAction(
  '[Client] Add Client Success',
  props<{ client: Customer }>()
);
export const addClientFailure = createAction(
  '[Client] Add Client Failure',
  props<{ error: string }>()
);

// Delete Client
export const deleteClient = createAction(
  '[Client] Delete Client',
  props<{ id: number }>()
);
export const deleteClientSuccess = createAction(
  '[Client] Delete Client Success',
  props<{ id: number }>()
);
export const deleteClientFailure = createAction(
  '[Client] Delete Client Failure',
  props<{ error: string }>()
);