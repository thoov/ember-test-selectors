'use strict';

/* eslint-env node */

let TEST_SELECTOR_PREFIX = /data-test-.*/;

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
