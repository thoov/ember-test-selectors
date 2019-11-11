import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import config from 'dummy/config/environment';
import {
  hasReliablePositionalParams,
  hasEmberVersion
} from 'dummy/version-checks';

module('StripTestSelectorsTransform plugin', function(hooks) {
  setupRenderingTest(hooks);

  if (config.stripTestSelectors) {
    (hasReliablePositionalParams ? test : skip)('it strips data-test-* attributes from components with single positional params', async function(assert) {
      await render(hbs`{{print-test-attributes data-test-should-not-be}}`);

      assert.dom('.data-test-positional-params').hasText(hasEmberVersion(2, 10) || !hasEmberVersion(2, 3) ? '' : '0', 'there should be no params');
    });

    (hasReliablePositionalParams ? test : skip)('it strips data-test-* attributes from components with positional params data-test-* as first param', async function(assert) {
      await render(hbs`{{print-test-attributes data-test-should-not-be "param1"}}`);

      assert.dom('.data-test-positional-params').hasText('1', 'there should be only one param');
    });

    (hasReliablePositionalParams ? test : skip)('it strips data-test-* attributes from components with multiple positional params', async function(assert) {
      await render(hbs`{{print-test-attributes "param1" data-test-should-not-be}}`);

      assert.dom('.data-test-positional-params').hasText('1', 'there should be only one param');
    });

    (hasReliablePositionalParams ? test : skip)('it strips data-test-* attributes from components with block and multiple positional params', async function(assert) {
      await render(hbs`{{#print-test-attributes "param1" data-test-should-not-be}}{{/print-test-attributes}}`);

      assert.dom('.data-test-positional-params').hasText('1', 'there should be only one param');
    });

    test('it strips data-test-* attributes from components', async function(assert) {
      await render(hbs`{{print-test-attributes data-test-first="foobar"}}`);

      assert.dom('.data-test-first').hasText('', 'the data-test-first was stripped');
    });

    test('it strips data-test-* attributes from components in block form', async function(assert) {
      await render(hbs`{{#print-test-attributes data-test-first="foobar"}}hello{{/print-test-attributes}}`);

      assert.dom('.data-test-first').hasText('', 'the data-test-first was stripped');
    });

    test('it works with multiple data-test-* attributes on components', async function(assert) {
      await render(hbs`{{print-test-attributes data-test-first="foobar" data-test-second="second"}}`);

      assert.dom('.data-test-first').hasText('', 'the data-test-first was stripped');
      assert.dom('.data-test-second').hasText('', 'the data-test-second attribute was stripped');
    });

    test('it leaves other data attributes untouched, when a data-test-* attribute is present as well on components', async function(assert) {
      await render(hbs`{{print-test-attributes data-test-first="foobar" data-non-test="baz"}}`);

      assert.dom('.data-test-first').hasText('', 'the data-test-first was stripped');
      assert.dom('.data-non-test').hasText('baz', 'the data-non-test attribute was not stripped');
    });

    test('it leaves data-test attributes untouched on components', async function(assert) {
      await render(hbs`{{print-test-attributes data-test="foo"}}`);

      assert.dom('.data-test').hasText('foo', 'the data-test attribute was stripped');
    });

    test('it leaves other data attributes untouched on components', async function(assert) {
      await render(hbs`{{print-test-attributes data-non-test="foo"}}`);

      assert.dom('.data-non-test').hasText('foo', 'the data-non-test attribute was not stripped');
    });
  } else {
    test('it does not strip data-test-* attributes from components', async function(assert) {
      await render(hbs`{{print-test-attributes data-test-first="foobar"}}`);

      assert.dom('.data-test-first').hasText('foobar', 'the data-test-first attribute was not stripped');
    });
  }
});
