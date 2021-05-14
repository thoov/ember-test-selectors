import { assert, deprecate } from '@ember/debug';
import { isArray } from '@ember/array';

const TEST_SELECTOR_PREFIX = /data-test-.*/;

export default function bindDataTestAttributes(component) {
  let dataTestProperties = [];
  for (let attr in component) {
    if (TEST_SELECTOR_PREFIX.test(attr)) {
      dataTestProperties.push(attr);
    }
  }

  if (dataTestProperties.length === 0) {
    return;
  }

  let tagName = component.get('tagName');

  if (component.get('supportsDataTestProperties') && tagName === '') {
    return;
  }

  let message = `ember-test-selectors could not bind data-test-* properties on ${component} ` +
    `automatically because tagName is empty. If you did this intentionally, see ` +
    `https://github.com/simplabs/ember-test-selectors#usage-in-computed-properties ` +
    `for instructions on how to disable this assertion.`;

  assert(message, tagName !== '', {
    id: 'ember-test-selectors.empty-tag-name',
  });

  let attributeBindings = component.get('attributeBindings') || [];
  if (!isArray(attributeBindings)) {
    attributeBindings = [attributeBindings];
  } else {
    attributeBindings = attributeBindings.slice();
  }

  for (let prop of dataTestProperties) {
    if (attributeBindings.indexOf(prop) === -1) {
      let componentName = extractComponentName(component) || `<unknown>`;
      deprecate(`You have set ${prop} on the ${componentName} component. Relying on automatic attribute binding of data-test properties on classic components is deprecated. Your options are:\n\n` +
        '- use angle bracket syntax with `...attributes` to invoke components\n' +
        '- explicitly add `attributeBindings` to the component\n' +
        '- stay on an older version of ember-test-selectors\n\n', false, {
        for: 'ember-test-selectors',
        id: 'ember-test-selectors.auto-binding',
        until: '6.0.0',
        since: { available: '5.2.0', enabled: '5.2.0' },
      });
      attributeBindings.push(prop);
    }
  }

  try {
    component.set('attributeBindings', attributeBindings);

  } catch (error) {
    let message = `ember-test-selectors could not bind data-test-* properties on ${component} ` +
      `automatically because "attributeBindings" is a read-only property.`;

    assert(message, false, {
      id: 'ember-test-selectors.computed-attribute-bindings',
    });
  }
}

function extractComponentName(component) {
  let debugKey = component._debugContainerKey;
  if (debugKey) {
    return debugKey.replace(/^component:/, '');
  }

  let className = component.constructor.name;
  if (className && className !== 'Class') {
    return className;
  }
}
