import Ember from 'ember';

const { RSVP } = Ember;

export default Ember.Route.extend({
  modelForm: {},
  selectedAgent: '',

  queryParams: {
    filterString: {
      as: 's',
      replace: true,
    },
    showInternalNames: {
      as: 'internal',
      replace: true,
    },
  },

  beforeModel() {
    return new RSVP.Promise((resolve, reject) => {
      this.store.getAvailableAgents('fence').then(
        (response) => {
          this.set('availables', response);
          resolve(response);
        },
        (xhr) => {
          reject(xhr);
        },
      );
    });
  },

  async model(params) {
    if (!this.get('selectedAgent')) {
      const agent = this.get('availables.undefinedProvider')[0];
      this.set('modelForm.fenceAgent', agent);
      this.set('selectedAgent', agent);
    }

    const metadata = await this.store.getAgentMetadata(
      'fence',
      `stonith:${this.get('selectedAgent')}`,
    );

    // @todo: bug in ember-form-for
    return Ember.RSVP.hash({
      availableAgents: this.get('availables'),
      params,
      metadata,
      formData: this.get('modelForm'),
      updatingCluster: this.store.peekAll('cluster'),
      selectedAgent: this.get('selectedAgent'),
      fences: this.store.peekAll('fence'),
    });
  },

  actions: {
    changeSelectedAgent(form, fieldName, selectedItem) {
      this.set('modelForm', form);
      this.set('selectedAgent', selectedItem);
      this.set('modelForm.fenceAgent', selectedItem);
      this.refresh();
    },

    onSubmitAction(steps, form) {
      form.get('changes').forEach((obj) => {
        if (typeof obj.value === 'object') {
          // EmptyObject is a result of value from select-field with (array)
          // which was not changed, so it should be ignored.
          obj.value = obj.value.name;
        }
      });

      form.save();
      steps['transition-to']('B');
      return Ember.RSVP.Promise.resolve();
    },
  },
});
