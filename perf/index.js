'use strict';

var thot = require('../index');
var Promise = require('bluebird');
var co = require('co');
var iterations = 100000;

var genfunc = function * (){
  yield Promise.resolve(1);
};

var thunk = function thunk(){
  return function(cb){
    cb(null, true);
  };
};

suite('Empty', function(){
  set('iterations', iterations);
  /* jshint ignore:start */
  bench('thot-gen', function(done){
    thot.run(function*(){

    })(done);
  });

  bench('co', function(done){
    co(function*(){

    })(done);
  });
  /* jshint ignore:end */
});

suite('Promises', function(){
  set('iterations', iterations);
  bench('thot-gen', function(done){
    thot.run(function*(){
      yield Promise.resolve(1);
    })(done);
  });

  bench('co', function(done){
    co(function*(){
      yield Promise.resolve(1);
    })(done);
  });
});

suite('Values', function(){
  set('iterations', iterations);
  bench('thot-gen', function(done){
    thot.run(function*(){
      yield 1;
    })(done);
  });
});

suite('Generator Functions', function(){
  set('iterations', iterations);
  bench('thot-gen', function(done){
    thot.run(function*(){
      yield genfunc;
    })(done);
  });

  bench('co', function(done){
    co(function*(){
      yield genfunc;
    })(done);
  });
});

suite('Generators', function(){
  set('iterations', iterations);
  bench('thot-gen', function(done){
    thot.run(function*(){
      yield genfunc();
    })(done);
  });

  bench('co', function(done){
    co(function*(){
      yield genfunc();
    })(done);
  });
});

suite('Yielded Generators', function(){
  set('iterations', iterations);
  bench('thot-gen', function(done){
    thot.run(function*(){
      var val = yield * genfunc();
      yield val;
    })(done);
  });

  bench('co', function(done){
    co(function*(){
      var val = yield * genfunc();
      yield val;
    })(done);
  });
});

suite('Thunks', function(){
  set('iterations', iterations);
  bench('thot-gen', function(done){
    thot.run(function*(){
      yield thunk();
    })(done);
  });

  bench('co', function(done){
    co(function*(){
      yield thunk();
    })(done);
  });
});

suite('Sync Functions', function(){
  set('iterations', iterations);
  bench('thot-gen', function(done){
    thot.run(function*(){
      yield (function(){
        return true;
      })();
    })(done);
  });
});

suite('Async Functions', function(){
  set('iterations', iterations);
  bench('thot-gen', function(done){
    thot.run(function*(){
      yield thot.resume(function (val, cb) {
        cb(null, val);
      })(2);
    })(done);
  });
});

suite('Abnormal Callback Functions', function(){
  set('iterations', iterations);
  bench('thot-gen', function(done){
    thot.run(function*(){
      yield thot.resumeRaw(function(cb){
        cb('ok', 'values', 'work');
      })();
    })(done);
  });
});

suite('Arrays', function(){
  set('iterations', iterations);
  bench('thot-gen', function(done){
    thot.run(function*(){
      yield [thunk(), Promise.resolve(1)];
    })(done);
  });

  bench('co', function(done){
    co(function*(){
      yield [thunk(), Promise.resolve(1)];
    })(done);
  });
});

suite('Objects', function(){
  set('iterations', iterations);
  bench('thot-gen', function(done){
    thot.run(function*(){
      yield {'thunk': thunk(), 'array': Promise.resolve(1)};
    })(done);
  });

  bench('co', function(done){
    co(function*(){
      yield {'thunk': thunk(), 'array': Promise.resolve(1)};
    })(done);
  });
});