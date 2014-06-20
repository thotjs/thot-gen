thot-gen
========

High performance bluebird based generator control flow library

[![Build Status](https://travis-ci.org/thotjs/thot-gen.svg)](https://travis-ci.org/thotjs/thot-gen)
[![Dependency Status](https://david-dm.org/thotjs/thot-gen.svg)](https://david-dm.org/thotjs/thot-gen)
[![devDependency Status](https://david-dm.org/thotjs/thot-gen/dev-status.svg)](https://david-dm.org/thotjs/thot-gen#info=devDependencies)
[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

Basic Usage
-------------

```javascript
var gen = require('thot-gen');
var run = gen.run;

run(function *(){
  yield 'some value';
  yield true;
  yield thunk;
  yield gen.resume(nodeStyleAsyncCallback)(1, 2);
  yield [1, 2];
  yield {some: 'value'};
})(function(err, result){});
```

or

```javascript
var gen = require('thot-gen');
var run = gen.run;

run(function *(){
  yield 'some value';
  yield true;
  yield thunk;
  yield gen.resume(nodeStyleAsyncCallback)(1, 2);
  yield [1, 2];
  yield {some: 'value'};
})().then(function(result){}, function(err){});
```

##API##

###run###
thotgen.run(genFunc);

Run is the main method of thot-gen. It turns a generator function into a function that can be called at any point.

When calling the function returned by run you can pass in an optional nodestyle callback method or if you don't the method will return a promise.

All of the promises are based on bluebird for performance and flexibility reasons. This allows you to easily add a lot of interesting control flow ontop of thot-gen without a lot of additional work.

If you would like to control the context that the generator is run in just call the returned method using call and passing in the context.

```javascript
run(function*(){
  yield this;
}).call({some: 'object'});
```

###resume###
thotgen.resume(func);

This method will turn a regular node-style callback into a thunked method. It's a convenience method that uses thunkify to convert the function.

###resumeRaw###
thotgen.resumeRaw(func);

This method is meant to be used with functions that don't follow the traditional nodestyle callback syntax of err, result or that return multiple results. This method makes no assumptions about what it will get back and will just return all values returned to the callback as an array. Be sure that you check for errors properly based on the function that you are using

###delay###
thotgen.delay(milliseconds);

This method is a shortcut to allow you to delay the execution of a generator by yielding the value

yield delay(500); will delay execution for 500 milliseconds.

###timeout###
thotgen.timeout(milliseconds, [string errormessage]);

This is a method on bluebird that allows you return an error for the promise if it doesn't complete within the specified amount of time

To take advantage of this method you do need to use the returned promise after running the couroutine

```javascript
thotgen.run(function*(){
  yield 'some possibly long running method here';
})().timeout(500, 'not fast enough');
```

###cancel###
thotgen.cancel([string errormessage]);

This method is very similar to timeout above but allows you to manual cancel the promise and return the error.

```javascript
var prom = thotgen.run(function*(){
  yield 'some possibly long running method';
})();
prom.cancel('changed my mind');
```

Cancel will not cancel a promise that has already been resolved.

##Bluebird##
Since thot-gen is built on top of bluebird you can use any of the additional methods that bluebird provides for a full list and documentation please see bluebirds documentations https://github.com/petkaantonov/bluebird/blob/master/API.md
