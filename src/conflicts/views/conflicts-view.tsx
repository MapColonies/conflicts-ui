import React from 'react';

import { useStore } from '../models/rootStore';
import { observer } from 'mobx-react-lite';
import { DateFilter } from '../components/date-filter';
import { HasResolvedFilter } from '../components/has-resolved-filter';
import { ConflictsTable } from '../components/conflicts-table';
import { VectorLayer, VectorSource, MapFilterContainer, GeoJSONFeature} from '@map-colonies/shared-components'

const ConflictsView: React.FC = observer(() => {
  const {conflictsStore} = useStore();
  return (
    <MapFilterContainer
      handlePolygonSelected={conflictsStore.searchParams.setLocation}
      handlePolygonReset={conflictsStore.searchParams.resetLocation}
      children={<ConflictsTable/>}
      filters={[<DateFilter/>, <HasResolvedFilter/>]}
      mapContent={
        <VectorLayer>
          <VectorSource>
            {conflictsStore.conflicts.map((conflict, index) => (
              <GeoJSONFeature key={index} geometry={conflict.location} />
            ))}
          </VectorSource>
        </VectorLayer>
      }
    />
  );
});

export default ConflictsView;
