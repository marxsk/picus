import {
  validateNumber,
  validateInclusion,
} from 'ember-changeset-validations/validators';

export default function validateScore() {
  return (key, newValue) => {
    if (
      (validateNumber({integer: true})('_', newValue) === true) ||
      (validateInclusion({list: ['INFINITY', '+INFINITY', '-INFINITY']})('_', newValue) === true)
    ) {
      return true;
    } else {
      return 'You have to enter integer value or +/-INFINTY';
    }
  };
}
