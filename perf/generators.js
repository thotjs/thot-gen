'use strict';

var thotGen = require('../');
var co = require('co');
var gen = require('gen-run');

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite({'async': true, 'minSamples': 100});

function done(deferred){
  return function(){
    deferred.resolve();
  };
}

var gen = function*(){
};

suite.add('thot-gen generators', {
  'defer': true,
  'async': true,
  'minSamples': 100,
  'fn': function(deferred){
    var end = done(deferred);
    thotGen.run(function * (){
      yield gen();
      return false;
    })(end);
  }
});

suite.add('co generators', {
  'defer': true,
  'async': true,
  'minSamples': 100,
  'fn': function(deferred){
    var end = done(deferred);
    co(function * (){
      yield gen();
      return false;
    })(end);
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