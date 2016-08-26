import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  key(i) {
    return `attribute ${i}`;
  },
  value(i) {
    return `${i}`;
  }
});
