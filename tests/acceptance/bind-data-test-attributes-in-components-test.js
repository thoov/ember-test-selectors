import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

import config from 'dummy/config/environment';

if (!config.stripTestSelectors) {

  /*
   * We use an acceptance test here to test the "ember-test-selectors" initializer,
   * because initializers are only applied in acceptance tests, but not in
   * component integration tests.
   */
  module('Acceptance | Initializer | ember-test-selectors', function(hooks) {
    setupApplicationTest(hooks);

    hooks.beforeEach(async function() {
      await visit('/bind-test');
    });

    test('it binds data-test-* attributes on components', function(assert) {
      assert.dom('.test1 div[data-test-first]').exists('data-test-first exists');
      assert.dom('.test1 div[data-test-first="foobar"]').exists('data-test-first has correct value');
    });

    test('it binds data-test-* attributes on components in block form', function(assert) {
      assert.dom('.test2 div[data-test-first]').exists('data-test-first exists');
      assert.dom('.test2 div[data-test-first="foobar"]').exists('data-test-first has correct value');
    });

    test('it works with multiple data-test-* attributes on components', function(assert) {
      assert.dom('.test3 div[data-test-first]').exists('data-test-first exists');
      assert.dom('.test3 div[data-test-first="foobar"]').exists('data-test-first has correct value');
      assert.dom('.test3 div[data-test-second]').exists('data-test-second exists');
      assert.dom('.test3 div[data-test-second="second"]').exists('data-test-second has correct value');
    });

    test('it leaves other data attributes untouched, when a data-test-* attribute is present as well on components', function(assert) {
      assert.dom('.test4 div[data-test-first]').exists('data-test-first exists');
      assert.dom('.test4 div[data-test-first="foobar"]').exists('data-test-first has correct value');
      assert.dom('.test4 div[data-non-test]').doesNotExist('data-non-test does not exists');
    });

    test('it leaves data-test attribute untouched on components', function(assert) {
      assert.dom('.test5 div[data-test]').doesNotExist('data-test does not exists');
    });

    test('it leaves other data attributes untouched on components', function(assert) {
      assert.dom('.test6 div[data-non-test]').doesNotExist('data-non-test does not exists');
    });

    test('it binds data-test-* attributes with boolean values on components', function(assert) {
      assert.dom('.test7 div[data-test-with-boolean-value]').exists('data-test-with-boolean-value exists');
    });

    test('it binds data-test attributes on {{link-to}} components', function(assert) {
      assert.dom('.test-link-to-block a').hasAttribute('data-test-foo', 'bar');
      assert.dom('.test-link-to-inline a').hasAttribute('data-test-foo', 'bar');
    });

    test('it handles the tagless components without assert when `supportsDataTestProperties` is set', function(assert) {
      assert.dom('.test12 div[data-test-with-boolean-value]').doesNotExist('data-test-with-boolean-value does not exist');
      assert.dom('.test13 div[data-test-without-value]').doesNotExist('data-test-without-value does not exist');
    });
  });
}
