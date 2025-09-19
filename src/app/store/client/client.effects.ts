import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ClientService } from '../../services/client.service';
import * as ClientActions from './client.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class ClientEffects {
  constructor(private actions$: Actions, private clientService: ClientService) {}

  loadClients$ = createEffect(() =>
    this.actions$?.pipe(
      ofType(ClientActions.loadClients),
      mergeMap(() =>
        this.clientService.getAll().pipe(
          map((clients) => ClientActions.loadClientsSuccess({ clients })),
          catchError((error) =>
            of(ClientActions.loadClientsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.addClient),
      mergeMap(({ client }) =>
        this.clientService.create(client).pipe(
          map((newClient) => ClientActions.addClientSuccess({ client: newClient })),
          catchError((error) =>
            of(ClientActions.addClientFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.deleteClient),
      mergeMap(({ id }) =>
        this.clientService.delete(id).pipe(
          map(() => ClientActions.deleteClientSuccess({ id })),
          catchError((error) =>
            of(ClientActions.deleteClientFailure({ error: error.message }))
          )
        )
      )
    )
  );
}