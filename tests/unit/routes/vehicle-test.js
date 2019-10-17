import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | vehicle', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:vehicle');
    assert.ok(route);
  });
});
