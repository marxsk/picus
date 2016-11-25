import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  include: ['nodes', 'resources', 'nodeAttributes', 'nodeUtilizationAttributes', 'properties'],
});
