import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientState } from './client.reducer';

export const selectClientState = createFeatureSelector<ClientState>('client');

export const selectClients = createSelector(
  selectClientState,
  (state) => state.clients
);

export const selectLoading = createSelector(
  selectClientState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectClientState,
  (state) => state.error
);