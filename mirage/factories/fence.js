import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return `Fence agent #${i}`;
  },
  agentType: 'fence_dummy',
});
