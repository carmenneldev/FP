import { createReducer, on } from '@ngrx/store';
import { Customer } from '../../models/customer.model';
import * as ClientActions from './client.actions';

export interface ClientState {
  clients: Customer[];
  loading: boolean;
  error: string | null;
}

export const initialState: ClientState = {
  clients: [],
  loading: false,
  error: null,
};

export const clientReducer = createReducer(
  initialState,
  on(ClientActions.loadClients, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ClientActions.loadClientsSuccess, (state, { clients }) => ({
    ...state,
    clients,
    loading: false,
  })),
  on(ClientActions.loadClientsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ClientActions.addClientSuccess, (state, { client }) => ({
    ...state,
    clients: [...state.clients, client],
  })),
  on(ClientActions.deleteClientSuccess, (state, { id }) => ({
    ...state,
    clients: state.clients.filter((client) => client.id !== id),
  }))
);