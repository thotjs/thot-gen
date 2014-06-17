'use strict';

var thotGen = require('../');
var co = require('co');
var gen = require('gen-run');
var suspend = require('suspend');

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite({'async': true, 'minSamples': 100});

var prom = Promise.resolve(1);

function done(deferred){
  return function(){
    deferred.resolve();
  };
}

suite.add('thot-gen promise', {
  'defer': true,
  'async': true,
  'minSamples': 100,
  'fn': function(deferred){
    var end = done(deferred);
    thotGen.run(function * (){
      yield prom;
      return false;
    })(end);
  }
});

suite.add('co promise', {
  'defer': true,
  'async': true,
  'minSamples': 100,
  'fn': function(deferred){
    var end = done(deferred);
    co(function * (){
      yield prom;
      return false;
    })(end);
  }
});

suite.add('suspend prom', {
  'defer': true,
  'async': true,
  'minSamples': 100,
  'fn': function(deferred){
    var end = done(deferred);
    suspend.run(function * (){
      yield prom;
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