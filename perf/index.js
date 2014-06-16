'use strict';

var co = require('../original_co');
var coop = require('../co-oop');
//var thotGen = require('../bluebird');
//var run = thotGen.run;
var final = require('../final');
var run = final.run;
var Q = require('q');

function getPromise(val, err) {
  return Q.fcall(function(){
    if (err){
      throw err;
    }
    return val;
  });
}

function done(deferred){
  return function(){
    deferred.resolve();
  };
}

function thunk(){
  return function(cb){
    cb();
  };
}

function normalFunction(cb){
  cb();
}

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();

suite.add('co empty', {
  'defer': true,
  'fn': function(deferred){
    var end = done(deferred);
    co(function * (){
      return false;
    })(end);
  }
});

suite.add('coop empty', {
  'defer': true,
  'fn': function(deferred){
    var end = done(deferred);
    coop(function * (){
      return false;
    })(end);
  }
});

suite.add('final empty', {
  'defer': true,
  'fn': function(deferred){
    var end = done(deferred);
    run(function * (){
      return false;
    })(end);
  }
});

suite.add('co promise', {
  'defer': true,
  'fn': function (deferred) {
    var end = done (deferred);
    co (function *() {
      yield getPromise (1);
      yield getPromise(2);
      yield getPromise(3);
    }) (end);
  }
});

suite.add('coop promise', {
  'defer': true,
  'fn': function (deferred) {
    var end = done (deferred);
    coop (function *() {
      yield getPromise (1);
      yield getPromise(2);
      yield getPromise(3);
    }) (end);
  }
});

suite.add('final promised', {
  'defer': true,
  'fn': function(deferred){
    var end = done(deferred);
    run(function * (){
      yield getPromise(1);
      yield getPromise(2);
      yield getPromise(3);
    })(end);
  }
});

/*suite.add('thot promise', {
  'defer': true,
  'fn': function (deferred) {
    var end = done (deferred);
    run (function *() {
      yield getPromise (1);
      yield getPromise(2);
      yield getPromise(3);
    })().then(end, end);
  }
});

suite.add('thot static value', {
  'defer': true,
  'fn': function (deferred) {
    var end = done (deferred);
    run (function *() {
      yield 1;
      yield 1;
      yield 2;
    }) (end);
  }
});
*/

/*suite.add('co thunk', {
  'defer': true,
  'fn': function (deferred) {
    var end = done (deferred);
    co (function *() {
      yield thunk();
      yield thunk();
      yield thunk();
    }) (end);
  }
});*/

/*suite.add('coop thunk', {
  'defer': true,
  'fn': function (deferred) {
    var end = done (deferred);
    coop (function *() {
      yield thunk();
      yield thunk();
      yield thunk();
    }) (end);
  }
});*/

/*suite.add('thot thunk', {
  'defer': true,
  'fn': function (deferred) {
    var end = done (deferred);
    run (function *() {
      yield thunk();
      yield thunk();
      yield thunk();
    }) (end);
  }
});

suite.add('thot function', {
  'defer': true,
  'fn': function (deferred){
    var end = done(deferred);
    run(function * (){
      yield normalFunction(thotGen.resume());
      yield normalFunction(thotGen.resume());
      yield normalFunction(thotGen.resume());
    })(end);
  }
});
*/
suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  console.log('Slowest is ' + this.filter('slowest').pluck('name'));
  this.map(function(item){
    console.log(item.name + ' Average Time :' + item.stats.mean);
  });
});

// run async
suite.run({'async': false});