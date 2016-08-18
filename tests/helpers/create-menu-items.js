import Ember from 'ember';

export default function createResources(total, countErrors = 0, childrenCount = 0) {
  const resources = Ember.A();

  for (let i=0; i < total; i++) {
    const resource = Ember.Object.extend({
      id: i,
      name: ('Resource #' + i),
      status: 'online',
      resources: Ember.A(),

      toString() {
        return `${this.get('name')}`;
      }
    }).create();

    if (i < countErrors) {
      resource.set('status', 'error');
    }

    for (let z=0; z < childrenCount; z++) {
      const child = Ember.Object.extend({
        id: (100 + z),
        name: ('Resource #' + (100 + z) ),
        status: 'online',
        resources: Ember.A(),

        toString() {
          return `${this.get('name')}`;
        }
      }).create();
      resource.resources.push(child);
    }

    resources.push(resource);
  }

  return resources;
}
