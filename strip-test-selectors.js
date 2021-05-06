'use strict';

/* eslint-env node */

let TEST_SELECTOR_PREFIX = /data-test-.*/;

function isTestSelector(attribute) {
  return TEST_SELECTOR_PREFIX.test(attribute);
}

function stripTestSelectors(node) {
  node.params = node.params.filter(function(param) {
    return !isTestSelector(param.original);
  });

  node.hash.pairs = node.hash.pairs.filter(function(pair) {
    return !isTestSelector(pair.key);
  });
}

function transform() {
  return {
    name: 'strip-test-selectors',

    visitor: {
      ElementNode(node) {
        node.attributes = node.attributes.filter(function(attribute) {
          return !isTestSelector(attribute.name);
        });
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
