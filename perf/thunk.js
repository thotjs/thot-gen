'use strict';

var thotGen = require('../');
var co = require('co');
var gen = require('gen-run');
var suspend = require('suspend');
var genny = require('genny');

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite({'async': true, 'minSamples': 100});

function done(deferred){
  return function(){
    deferred.resolve();
  };
}

var thunk = function thunk(){
  return function(cb){
    cb();
  };
};

suite.add('thot-gen thunk', {
  'defer': true,
  'async': true,
  'minSamples': 100,
  'fn': function(deferred){
    var end = done(deferred);
    thotGen.run(function * (){
      yield thunk();
      return false;
    })(end);
  }
});

suite.add('co thunk', {
  'defer': true,
  'async': true,
  'minSamples': 100,
  'fn': function(deferred){
    var end = done(deferred);
    co(function * (){
      yield thunk();
      return false;
    })(end);
  }
});

suite.add('gen-run thunk', {
  'defer': true,
  'async': true,
  'minSamples': 100,
  'fn': function(deferred){
    var end = done(deferred);
    gen(function * (){
      yield thunk();
      return false;
    }, end);
  }
});

suite.add('suspend thunk', {
  'defer': true,
  'async': true,
  'minSamples': 100,
  'fn': function(deferred){
    var end = done(deferred);
    suspend.run(function * (){
      yield thunk();
      return false;
    }, end);
  }
});

suite.add('genny thunk', {
  'defer': true,
  'async': true,
  'minSamples': 100,
  'fn': function(deferred){
    var end = done(deferred);
    genny.run(function * (resume){
      yield thunk();
      return false;
    }, end);
  }
});

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

suite.run();