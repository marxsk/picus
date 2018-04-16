import { validatePresence, validateNumber } from 'ember-changeset-validations/validators';

/**
 *  Create base information for form generation from XML metadata
 *
 *  XML metadata provides a lot of meta-information that can be used for form
 *  generation. Some of these features is not parsable in templates so this
 *  function provides required transformations.
 *
 *  @param {Object[]} result.parameters - Keys are 'levels' filled with individual field names
 *  @param {Object[]} result.validations - Keys are field names filled with list of the validations
 *
 *  @todo Find a better name for this function
 * */

// input: parameters from resource/fence agent metadata
// output: array [level] of array [properties + validations]
export default function categorizeProperties(parameters) {
  const result = {};
  result.validations = {};
  result.parameters = {};

  if (parameters === undefined) {
    return result;
  }

  parameters.forEach((i) => {
    result.validations[i.name] = [];

    if (i.required) {
      if (i.name !== 'port') {
        // @workaround: pacemaker bug; port should not be required as it automatically added
        //    via pcmk_host_list/pcmk_host_map
        result.validations[i.name].push(validatePresence({ presence: true }));
      }
    }
    if (i.type === 'integer') {
      result.validations[i.name].push(validateNumber({ integer: true, allowBlank: true }));
    }

    if (i.type === 'boolean') {
      if (i.default === '1') {
        i.default = true;
      } else if (i.default === null || i.default === '0') {
        i.default = false;
      }
    }

    const level = i.level ? i.level : 'standard';

    if (!(level in result.parameters)) {
      result.parameters[level] = [];
    }
    result.parameters[level].push(i);
  });

  return result;
}
