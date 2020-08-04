/* eslint-disable @typescript-eslint/naming-convention */
import { types, Instance } from 'mobx-state-tree';
import { Geometry } from 'geojson';

export const Conflict = types.model({
  id: types.identifier,
  source_server: types.string,
  target_server: types.string,
  source_entity: types.frozen(),
  target_entity: types.frozen(),
  description: types.string,
  location: types.frozen<Geometry>(),
  has_resolved: types.boolean,
  resolved_at: types.maybeNull(types.Date),
  resolution_id: types.maybeNull(types.string),
  created_at: types.Date,
  updated_at: types.Date,
  deleted_at: types.maybeNull(types.Date),
});

export interface IConflict extends Instance<typeof Conflict> {}
