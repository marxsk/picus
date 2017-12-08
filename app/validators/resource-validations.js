import { validatePresence, validateLength } from 'ember-changeset-validations/validators';

export default {
  resourceName: [
    validatePresence({ presence: true, ignoreBlank: false }),
    validateLength({ min: 4, allowBlank: false, allowNone: false }),
  ],
};
