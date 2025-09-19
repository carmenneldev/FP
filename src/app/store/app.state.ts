import { ClientState } from './client/client.reducer';

export interface AppState {
  client: ClientState; // Add the client state to the global AppState
}