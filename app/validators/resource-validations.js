import { validatePresence } from 'ember-changeset-validations/validators';

export default {
  resourceName: [
    validatePresence({ presence: true, ignoreBlank: false }),
  ],
};
