import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  include: ['nodes', 'resources'],

  typeKeyForModel() {
    return 'cluster';
  }
});
