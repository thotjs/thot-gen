'use strict';

var slice = require('sliced');
var Promise = require('bluebird');
var co = Promise.coroutine;
var delay = Promise.delay;
var ctx = null;
var thunkify = require('thunkify');

var bind = function bind(func, receiver){
  return function(){
    return func.apply(receiver, arguments);
  };
};

var resume = function resume(func){
  return thunkify(func);
};

var genToGenFunc = function genToGenFunc(gen){
  var genHandler = function * genHandler(){
    var data = yield * gen;
    return data;
  };
  return genHandler;
};

var resumeRaw = function resumeRaw(func){
  return function(cb){
    var args = slice(arguments);
    args[args.length - 1] = function(){
      var data = slice(arguments);
      cb(null, data);
    };

    func.apply(ctx, args);
  };
};

var yieldHandler = function yieldHandler(value){
  // this is here so we don't have to call it at the front of each check if value is falsey
  if(!value){
    return Promise.resolve(value);
  }

  if(typeof value.then === 'function'){
    return value;
  }

  if(isGeneratorFunction(value)){
    return run(value).call(ctx);
  }

  if(typeof value.next === 'function' && typeof value.throw === 'function'){
    var gen = genToGenFunc(value);
    return run(gen).call(ctx);
  }

  if(typeof value === 'function'){
    var def = Promise.defer();
    try { value.call(ctx, def.callback); } catch(e) { def.reject(e); }
    return def.promise;
  }

  if(typeof value === 'object' || Array.isArray(value)){
    value = Object.keys(value);

    value.forEach(function(val, index){
      value[index] = yieldHandler(val);
    });

    return Promise.all(value);
  }

  return Promise.resolve(value);
};

var isGeneratorFunction = function isGeneratorFunction(obj){
  return obj && obj.constructor && obj.constructor.name === 'GeneratorFunction';
};

var run = function run(gen){
  if(!isGeneratorFunction(gen)){
    throw new Error('Must provide a generator function');
  }

  return function(callback) {
    ctx = this;
    var fn = co(bind(gen, ctx), {'yieldHandler': yieldHandler})().bind(ctx).cancellable();

    return fn.nodeify(callback);
  };
};

module.exports = {
  'run': run,
  'resume': resume,
  'resumeRaw': resumeRaw,
  'delay': delay
};