'use strict';
var thot = require('../index');
var run = thot.run;
var Promise = require('bluebird');
var assert = require('assert');

function getPromise(val) {
  return Promise.resolve(val);
}

function thunk(val){
  return function(cb){
    cb(null, val);
  };
}

describe('Thot-Gen', function(){
  it('Should support promises', function(done){
    run(function*(){
      var value = yield getPromise('ok');
      return value;
    })(function(err, result){
      assert.equal(err, null);
      assert.equal(result, 'ok');
      done();
    });
  });

  it('Should support delay', function(done){
    run(function *(){
      yield thot.delay(200);
      return 1;
    })(function(err, result){
      assert.equal(err, null);
      assert.equal(result, 1);
      done();
    });
  });

  it('Should Handle Contexts Properly', function(done){
    var ctx = {'some': 'ctx'};

    run(function *(){
      assert.equal(this, ctx);
      yield true;
      return true;
    }).call(ctx, function(err, result){
      assert.equal(this, ctx);
      assert.equal(err, null);
      assert.equal(result, true);
      done();
    });
  });

  it('Should work with timeout', function(done){
    run(function *(){
      yield thot.delay(1000);
    })().timeout(100).then(null, function(err){
      assert.notEqual(err, null);
      done();
    });
  });

  it('Should support cancelling the promise', function(done) {
    var cancellable = run(function *(){
      yield thot.delay(100);
    })().then(null, function(err){
      assert.notEqual(err, null);
      done();
    });
    cancellable.cancel();
  });

  it('Should handle non-standard values', function(done){
    run(function *(){
      var bool = yield true;
      return bool;
    })(function(err, result){
      assert.equal(err, null);
      assert.equal(result, true);
      done();
    });
  });

  it('Should support nested contexts', function(done) {
    var ctx = {'nested': ctx};
    run(function*() {
      var val = yield function *() {
        assert.equal(this, ctx);
        yield thot.delay(100);
        assert.equal(this, ctx);
        return 2;
      };
      return val;
    }).call(ctx, function (err, result) {
      assert.equal(this, ctx);
      assert.equal(err, null);
      assert.equal(result, 2);
      done();
    });
  });

  it('Should support yielding generators directly', function(done){
    run(function*(){
      var bool = yield function *(){
        var boolean = yield true;
        return boolean;
      };
      return bool;
    })(function(err, result){
      assert.equal(err, null);
      assert.equal(result, true);
      done();
    });
  });

  it('Should allow yield *', function(done){
    var gen = (function*(){
      yield true;
      return true;
    })();
    run(function*(){
      var tmp = yield * gen;
      return tmp;
    })(function(err, result){
      assert.equal(err, null);
      assert.equal(result, true);
      done();
    });
  });

  it('Should allow yielding thunks', function(done){
    run(function*(){
      var val = yield thunk(1);
      return val;
    })(function(err, result){
      assert.equal(err, null);
      assert.equal(result, 1);
      done();
    });
  });

  it('Should support synchronous functions', function(done){
    run(function*(){
      var val = yield (function(){
        return 1;
      })();
      return val;
    })(function(err, result){
      assert.equal(err, null);
      assert.equal(result, 1);
      done();
    });
  });

  it('Should support trapping synchronous errors', function(done){
    run(function*(){
      var val = yield (function(){
        throw new Error('Boom');
      })();
      return val;
    })(function(err, result){
      assert.notEqual(err, null);
      assert.equal(result, null);
      done();
    });
  });

  it('Should support async functions', function(done){
    run(function*(){
      var val = yield thot.resume(function(cb){
        cb(null, 1);
      })();
      return val;
    })(function(err, result){
      assert.equal(err, null);
      assert.equal(result, 1);
      done();
    });
  });

  it('Should catch async errors', function(done){
    run(function*(){
      var val = yield thot.resume(function(){
        throw new Error('Boom');
      })();
      return val;
    })(function(err, result) {
      assert.notEqual(err, null);
      assert.equal(result, null);
      done();
    });
  });

  it('Should catch async callback errors', function(done){
    run(function*(){
      var val = yield thot.resume(function(cb){
        cb(new Error('Boom'));
      })();
      return val;
    })(function(err, result) {
      assert.notEqual(err, null);
      assert.equal(result, null);
      done();
    });
  });

  it('Should support non standard callbacks', function(done){
    run(function*(){
      var val = yield thot.resumeRaw(function(cb){
        cb('raw', 'resume', 'works');
      })();
      return val;
    })(function(err, result){
      assert.equal(err, null);
      assert.equal(Array.isArray(result), true);
      done();
    });
  });

  it('Should support arrays', function(done){
    run(function*(){
      var arr = yield [thunk(), getPromise(1)];
      return arr;
    })(function(err, result){
      assert.equal(err, null);
      assert.equal(Array.isArray(result), true);
      done();
    });
  });

  it('Should support objects', function(done){
    run(function*(){
      var arr = yield {'thunk': thunk(), 'promise': getPromise(1)};
      return arr;
    })(function(err, result){
      assert.equal(err, null);
      assert.equal(typeof result, 'object');
      done();
    });
  });
});