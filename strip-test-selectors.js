'use strict';

/* eslint-env node */

let TEST_SELECTOR_PREFIX = /data-test-.*/;

function isTestSelector(attribute) {
  return TEST_SELECTOR_PREFIX.test(attribute);
}

function stripTestSelectors(node) {
  node.params = node.params.filter(param => !isTestSelector(param.original));
  node.hash.pairs = node.hash.pairs.filter(pair => !isTestSelector(pair.key));
}

function transform() {
  return {
    name: 'strip-test-selectors',

    visitor: {
      ElementNode(node) {
        node.attributes = node.attributes.filter(attribute => !isTestSelector(attribute.name));
      },

      MustacheStatement(node) {
        stripTestSelectors(node);
      },

      BlockStatement(node) {
        stripTestSelectors(node);
      },
    }
  };
}

module.exports = transform;
