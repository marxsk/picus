import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  typeKeyForModel(model) {
    // standard pluralization is unwanted because of input JSONAPI format
    return model.modelName;
  },
});
