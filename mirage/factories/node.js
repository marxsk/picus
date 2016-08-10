import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  name(i) {
    return `Node #${i}`;
  },
  status: 'online',
});
