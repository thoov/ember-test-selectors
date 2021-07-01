'use strict';

/* eslint-env node */

let TEST_SELECTOR_PREFIX = /data-test-.*/;
let shownDeprecationWarning = false;

function isTestSelectorParam(param) {
  return param.type === 'PathExpression'
    && TEST_SELECTOR_PREFIX.test(param.original);
}

module.exports = function(env) {
  let b = env.syntax.builders;
  let transform = (node) => {
    if ('sexpr' in node) {
      node = node.sexpr;
    }

    let testSelectorParams = [];
    let otherParams = [];

    node.params.forEach(function(param) {
      if (isTestSelectorParam(param)) {
        testSelectorParams.push(param);
        if (!shownDeprecationWarning) {
          // eslint-disable-next-line no-console
          console.warn(
            '\n\n[ember-test-selectors] DEPRECATION: Using data-test ' +
            'parameters without values in curly component invocations is ' +
            'deprecated. You can use https://github.com/simplabs/ember-test-selectors-params-codemod ' +
            'to migrate away from this pattern. See https://github.com/simplabs/ember-test-selectors/issues/151 ' +
            'for more details.\n'
          );

          shownDeprecationWarning = true;
        }
      } else {
        otherParams.push(param);
      }
    });

    node.params = otherParams;

    testSelectorParams.forEach(function(param) {
      let pair = b.pair(param.original, b.boolean(true));
      node.hash.pairs.push(pair);
    });
  };

  return {
    name: 'TransformTestSelectorParamsToHashPairs',

    visitor: {
      MustacheStatement: transform,
      BlockStatement: transform,
    },
  };
};

module.exports.baseDir = function() {
  return __dirname;
};

module.exports.cacheKey = function() {
  return 'transform-test-selector-params-to-hash-pairs';
};
