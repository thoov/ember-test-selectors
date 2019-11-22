ember-test-selectors
==============================================================================

[![Latest NPM release][npm-badge]][npm-badge-url]
[![TravisCI Build Status][travis-badge]][travis-badge-url]

[npm-badge]: https://img.shields.io/npm/v/ember-test-selectors.svg
[npm-badge-url]: https://www.npmjs.com/package/ember-test-selectors
[travis-badge]: https://img.shields.io/travis/simplabs/ember-test-selectors/master.svg?label=TravisCI
[travis-badge-url]: https://travis-ci.org/simplabs/ember-test-selectors

Enabling better element selectors in [Ember.js](http://emberjs.com) tests

Features
------------------------------------------------------------------------------

- Removes attributes starting with `data-test-` from HTML tags and
  component/helper invocations in your templates for production builds

- Removes properties starting with `data-test-` from your JS objects like
  component classes for production builds

- Automatically binds properties starting with `data-test-` on all components
  for development/testing builds

More information on why that is useful are available on our
[blog](http://simplabs.com/blog/2016/03/04/ember-test-selectors.html)!

[![ember-test-selectors](https://cloud.githubusercontent.com/assets/2922250/25236119/0cc8e13a-25b5-11e7-8a5b-f29589384833.png)
](https://embermap.com/video/ember-test-selectors)


Compatibility
------------------------------------------------------------------------------

- Ember 2.16 or above
- Ember CLI 2.14 or above
- Node.js 8 or above


Installation
------------------------------------------------------------------------------

```bash
ember install ember-test-selectors
```


Usage
------------------------------------------------------------------------------

In your templates you are now able to use `data-test-*` attributes, which are
automatically removed from `production` builds:

```hbs
<article>
  <h1 data-test-post-title data-test-resource-id={{post.id}}>{{post.title}}</h1>
  <p>{{post.body}}</p>
  <LikeButton data-test-like-button />
</article>
```

Once you've done that you can use attribute selectors to look up and interact
with those elements:

```js
assert.dom('[data-test-post-title]').hasText('Ember is great!');

await click('[data-test-like-button]');
```

### Usage in Components

You can also use `data-test-*` attributes on components in curly component
invocation:

```handlebars
{{comments-list data-test-comments-for=post.id}}
```

These `data-test-*` attributes will be bound automatically and available
as data attributes on the `<div>` wrapping the component template:

```html
<div id="ember123" data-test-comments-for="42">
  <!-- comments -->
</div>
```

### Usage with tagless components

Since tagless components do not have a root element, `data-test-*` attributes
passed to them cannot be bound to the DOM. If you try to pass a `data-test-*`
attribute to a tagless component, or define one in its Javascript class,
`ember-test-selectors` will throw an assertion error.

However, there are some cases where you might want to pass a `data-test-*`
attribute to a tagless component, for example a tagless wrapper component:

```js
// comment-wrapper.js
export default Ember.Component({
  tagName: ''
});
```

```hbs
{{!-- comment-wrapper.hbs --}}
Comment:
{{comment-list-item comment=comment data-test-comment-id=data-test-comment-id}}
```

```handlebars
{{!-- comment-list.hbs --}}
{{#each comments as |comment|}}
  {{comment-wrapper comment=comment data-test-comment-id=comment.id}}
{{/each}}
```

In this case, to prevent the assertion on the specific `comment-wrapper`
component, you can specify `supportsDataTestProperties` on the class:

```js
// comment-wrapper.js
export default Ember.Component({
  tagName: '',
  supportsDataTestProperties: true
});
```

`supportsDataTestProperties`, like `data-test-*` properties, will be stripped
from the build.

#### With splattributes
Splattributes of angle brackets invocations, introduced in Ember.js 3.4 or
available through the
[ember-angle-bracket-invocation-polyfill](https://github.com/rwjblue/ember-angle-bracket-invocation-polyfill)
for earlier versions of Ember.js, work well with test selectors and tagless
components.

For instance, we have a `SpecialButton` that wraps a `<button>` element. We can
then pass arbitrary test selectors through splattributes, as follows:

```js
// special-button.js
export default Ember.Component({
  tagName: '',
  supportsDataTestProperties: true
});
```

```hbs
{{!-- special-button.hbs --}}
<button ...attributes>
  {{yield}}
</button>
```

Then

```hbs
<SpecialButton data-test-description="invite-user">
  Invite
</SpecialButton>
```

will yield


```html
<button data-test-description="invite-user">
  Invite
</button>
```

### Usage in Ember addons

If you want to use ember-test-selectors in an addon make sure that it appears
in the `dependencies` section of the `package.json` file, not in the
`devDependencies`. This ensures that the selectors are also stripped correctly
even if the app that uses the addon does not use ember-test-selectors itself.


Configuration
------------------------------------------------------------------------------

You can override when the `data-test-*` attributes should be stripped from the
build by modifying your `ember-cli-build.js` file:

```js
var app = new EmberApp({
  'ember-test-selectors': {
    strip: false
  }
});
```

`strip` accepts a `Boolean` value and defaults to `!app.tests`, which means
that the attributes will be stripped for production builds, unless the build
was triggered by `ember test`. That means that if you use
`ember test --environment=production` the test selectors will still work, but
for `ember build -prod` they will be stripped out.

License
------------------------------------------------------------------------------

ember-test-selectors is developed by and &copy;
[simplabs GmbH](http://simplabs.com) and contributors. It is released under the
[MIT License](https://github.com/simplabs/ember-simple-auth/blob/master/LICENSE).

ember-test-selectors is not an official part of [Ember.js](http://emberjs.com)
and is not maintained by the Ember.js Core Team.
