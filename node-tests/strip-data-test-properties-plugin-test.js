let fs = require('fs');
let assert = require('assert');
let multidepRequire = require('multidep')('node-tests/multidep.json');

let babel5 = multidepRequire('babel-core', '5.8.33');
let babel6 = multidepRequire('babel-core', '6.24.0');
let babel7 = require('@babel/core');

let StripDataTestPropertiesPlugin5 = require('../strip-data-test-properties-plugin');
let StripDataTestPropertiesPlugin6 = require('../strip-data-test-properties-plugin6');

function testFixture(name) {
  it(`Babel5: fixture: ${name}`, function() {
    let fixturePath = `${__dirname}/fixtures/${name}/fixture.js`;
    let expectedPath = `${__dirname}/fixtures/${name}/expected.js`;

    let expected = fs.readFileSync(expectedPath, 'utf8').replace(/\r\n/g, '\n');
    let result = babel5.transformFileSync(fixturePath, {
      plugins: [StripDataTestPropertiesPlugin5],
    });

    assert.strictEqual(result.code.trim(), expected.trim());
  });

  it(`Babel6: fixture: ${name}`, function() {
    let fixturePath = `${__dirname}/fixtures/${name}/fixture.js`;
    let expectedPath = `${__dirname}/fixtures/${name}/expected6.js`;

    let expected = fs.readFileSync(expectedPath, 'utf8').replace(/\r\n/g, '\n');

    let result = babel6.transformFileSync(fixturePath, {
      plugins: [StripDataTestPropertiesPlugin6],
    });

    assert.strictEqual(result.code.trim(), expected.trim());
  });

  it(`Babel7: fixture: ${name}`, function() {
    let fixturePath = `${__dirname}/fixtures/${name}/fixture.js`;
    let expectedPath = `${__dirname}/fixtures/${name}/expected7.js`;

    let expected = fs.readFileSync(expectedPath, 'utf8').replace(/\r\n/g, '\n');

    let result = babel7.transformFileSync(fixturePath, {
      plugins: [StripDataTestPropertiesPlugin6],
    });

    assert.strictEqual(result.code.trim(), expected.trim());
  });
}

describe('StripDataTestProperties plugin', function() {
  testFixture('default');
});

