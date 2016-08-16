import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return `Cluster ${i}`;
  },
  status: 'running',
  nodes: [],
  resources: [],
});
