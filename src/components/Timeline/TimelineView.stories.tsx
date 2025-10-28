import TimelineView from './TimelineView';
import {
   sampleRows,
   sampleTasks,
   sampleBigRows,
   sampleBigTasks,
} from '../../constants/sampleData';

export default {
   title: 'TimelineView',
   component: TimelineView,
};

export const Default = () => (
   <TimelineView rows={sampleRows} tasks={sampleTasks} />
);
export const Empty = () => <TimelineView rows={[]} tasks={{}} />;

export const BigDataSets = () => (
   <TimelineView rows={sampleBigRows} tasks={sampleBigTasks} />
);

console.log(sampleBigTasks);
