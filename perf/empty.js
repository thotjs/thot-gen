'use strict';

var thotGen = require('../');
var co = require('co');
var gen = require('gen-run');
var suspend = require('suspend');

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite({'async': true, 'minSamples': 100});

function done(deferred){
  return function(){
    deferred.resolve();
  };
}

suite.add('thot-gen empty', {
  'defer': true,
  'async': true,
  'minSamples': 1000,
  'initCount': 100,
  'fn': function(deferred){
    var end = done(deferred);
    thotGen.run(function * (){
      return false;
    })(end);
  }
});

suite.add('co empty', {
  'defer': true,
  'async': true,
  'minSamples': 1000,
  'initCount': 100,
  'fn': function(deferred){
    var end = done(deferred);
    co(function * (){
      return false;
    })(end);
  }
});

suite.add('gen-run empty', {
  'defer': true,
  'async': true,
  'minSamples': 1000,
  'initCount': 100,
  'fn': function(deferred){
    var end = done(deferred);
    gen(function * (){
      return false;
    }, end);
  }
});

suite.add('suspend empty', {
  'defer': true,
  'async': true,
  'minSamples': 1000,
  'initCount': 100,
  'fn': function(deferred){
    var end = done(deferred);
    suspend.run(function * (){
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