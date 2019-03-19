import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | tic-tac-toe', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:tic-tac-toe');
    assert.ok(route);
  });
});
