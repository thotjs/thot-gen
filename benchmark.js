'use strict';

var co = require('./original_co');
var coop = require('./co-oop');
var thotGen = require('./bluebird');
var run = thotGen.run;
var final = require('./final');
var runner = final.run;

var Q = require('q');

function fun(done) {
  done();
}

function *gen() {

}

function normalFunction(cb){
  cb(null);
}

function getPromise(val, err) {
  return Q.fcall(function(){
    if (err) throw err;
    return val;
  });
}

suite('co()', function(){
  set('mintime', process.env.MINTIME | 0 || 2000)

  bench('co promises', function(done){
    coop(function *(){
      yield getPromise(1);
      yield getPromise(2);
      yield getPromise(3);
    })(done);
  })

/*  bench('co thunks', function(done){
    coop(function *(){
      yield setImmediate;
      yield fun;
      yield fun;
      yield fun;
    })(done);
  })

  bench('co arrays', function(done){
    coop(function *(){
      yield setImmediate;
      yield [fun, fun, fun];
    })(done);
  })

  bench('co objects', function(done){
    co(function *(){
      yield setImmediate;
      yield {
        a: fun,
        b: fun,
        c: fun
      };
    })(done);
  })

  bench('co generators', function(done){
    co(function *(){
      yield setImmediate;
      yield gen();
      yield gen();
      yield gen();
    })(done);
  })

  bench('co generators delegated', function(done){
    co(function *(){
      yield setImmediate;
      yield* gen();
      yield* gen();
      yield* gen();
    })(done);
  })

  bench('co generator functions', function(done){
    co(function *(){
      yield setImmediate;
      yield gen;
      yield gen;
      yield gen;
    })(done);
  })*/
})

suite('coop()', function(){
  set('mintime', process.env.MINTIME | 0 || 2000)

  bench('coop promises', function(done){
    coop(function *(){
      yield getPromise(1);
      yield getPromise(2);
      yield getPromise(3);
    })(done);
  })
/*
  bench('coop thunks', function(done){
    coop(function *(){
      yield setImmediate;
      yield fun;
      yield fun;
      yield fun;
    })(done);
  })

  bench('coop arrays', function(done){
    coop(function *(){
      yield setImmediate;
      yield [fun, fun, fun];
    })(done);
  })

  bench('coop objects', function(done){
    coop(function *(){
      yield setImmediate;
      yield {
        a: fun,
        b: fun,
        c: fun
      };
    })(done);
  })

  bench('coop generators', function(done){
    coop(function *(){
      yield setImmediate;
      yield gen();
      yield gen();
      yield gen();
    })(done);
  })

  bench('coop generators delegated', function(done){
    coop(function *(){
      yield setImmediate;
      yield* gen();
      yield* gen();
      yield* gen();
    })(done);
  })

  bench('coop generator functions', function(done){
    coop(function *(){
      yield setImmediate;
      yield gen;
      yield gen;
      yield gen;
    })(done);
  })*/
})

suite('thot()', function(){
  set('mintime', process.env.MINTIME | 0 || 2000)

  bench('thot promises', function(done){
    runner(function *(){
      yield getPromise(1);
      yield getPromise(2);
      yield getPromise(3);
    })(done);
  })

/*  bench('thot thunks', function(done){
    run(function *(){
      yield setImmediate;
      yield fun;
      yield fun;
      yield fun;
    })(done);
  })

  bench('thot arrays', function(done){
    run(function *(){
      yield setImmediate;
      yield [fun, fun, fun];
    })(done);
  })

  bench('thot objects', function(done){
    run(function *(){
      yield setImmediate;
      yield {
        a: fun,
        b: fun,
        c: fun
      };
    })(done);
  })

  bench('thot generators delegated', function(done){
    run(function *(){
      yield setImmediate;
      yield* gen();
      yield* gen();
      yield* gen();
    })(done);
  })

  bench('thot generator functions', function(done){
    run(function *(){
      yield setImmediate;
      yield gen;
      yield gen;
      yield gen;
    })(done);
  })

  bench('thot static values', function(done){
    run(function *(){
      yield setImmediate;
      yield 1;
      yield 2;
      yield 3;
    })(done);
  })

  bench('thot normal function', function(done){
    run(function *(){
      var resume = thotGen.resume();
      yield setImmediate;
      yield normalFunction(resume);
      resume = thotGen.resume();
      yield normalFunction(resume);
      resume = thotGen.resume();
      yield normalFunction(resume);
    })(done);
  })*/
})