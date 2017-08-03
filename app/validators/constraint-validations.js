import {
  validatePresence,
} from 'ember-changeset-validations/validators';
import validateScore from './score';

export default {
  score: [
    validateScore(),
    validatePresence({presence: true, ignoreBlank: false}),
  ],
};
