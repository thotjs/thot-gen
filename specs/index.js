'use strict';
var final = require('../index');
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

function thunk(){
  return function(cb){
    cb(null, 'Thunks Work');
  };
}

run(function *(){
  var value = yield getPromise('Promises Work');
  return value;
})().then(function(result){
  console.log(result);
});

run(function *(){
  yield final.delay(100);
})().then(function(){
  console.log('delay works');
});

run(function *(){
  console.log('inside context');
  console.log(this);
  yield true;
}).call({'context': 'works'}).then(function(){
  console.log('outside context');
  console.log(this);
});

run(function *(){
  yield final.delay(1000);
})().timeout(100).then(function(){
  console.log('timeout didn\'t work');
}, function(){
  console.log('timeout function worked');
});

var cancellable = run(function *(){
  yield final.delay(100);
})().then(function(){
  console.log('cancel did not work');
}, function(){
  console.log('cancel did work');
});
cancellable.cancel();

run(function *(){
  var val = yield 'standard values work';
  return val;
})().then(function(result){
  console.log(result);
});

run(function *(){
  var val = yield function *(){
    yield final.delay(100);
    return this;
  };
  return val;
}).call({'nested': 'ctx'}).then(function(result){
  console.log(result);
});

run(function *(){
  yield (function *(){
    yield true;
    return true;
  })();
  return 'yielding generators directly works';
})().then(function(result){
  console.log(result);
}, function(err){
  console.log(err);
});

run(function *(){
  var tmp = yield * (function *(){
    yield true;
    return true;
  })();
  yield tmp;
  return 'yielding generators with yield * works';
})().then(function(result){
  console.log(result);
}, function(err){
  console.log(err);
});

run(function *(){
  var val = yield thunk();
  return val;
})().then(function(result){
  console.log(result);
});

run(function *(){
  var val = yield final.sync(function(){
    return 'Sync Functions Work';
  })();
  return val;
})().then(function(result){
  console.log(result);
});

run(function *(){
  var val = yield final.sync(function(){
    throw new Error('Sync function errors are trapped');
  })();
  return val;
})().then(function(result){
  console.log(result);
}, function(err){
  console.log(err);
});

run(function *(){
  var val = yield final.resume(function(cb){
    cb(null, 'Async Functions Work');
  })();
  return val;
})().then(function(result){
  console.log(result);
});

run(function *(){
  var val = yield final.resume(function(){
    throw new Error('Async function throws are caught');
  })();
  return val;
})().then(function(result){
  console.log(result);
}, function(err){
  console.log(err);
});

run(function *(){
  var val = yield final.resume(function(cb){
    cb('Async cb errors are caught');
  })();
  return val;
})().then(function(result){
  console.log(result);
}, function(err){
  console.log(err.message);
});

run(function *(){
  var val = yield final.resumeRaw(function(cb){
    cb('raw', 'resume', 'works');
  })();
  return val;
})().then(function(result){
  console.log(result);
});

run(function *(){
  var val = yield ['arrays', 'work'];
  return val;
})().then(function(result){
  console.log(result);
});

run(function *(){
  var val = yield {'objects': 'work'};
  return val;
})().then(function(result){
  console.log(result);
});