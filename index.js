'use strict';

var slice = require('sliced');
var _ = require('lodash');
var Promise = require('bluebird');
var co = Promise.coroutine;
var delay = Promise.delay;
var ctx = null;

var resume = function resume(func){
  return Promise.promisify(func, ctx);
};

var genToGenFunc = function genToGenFunc(gen){
  var genHandler = function * genHandler(){
    var data = yield * gen;
    return data;
  };
  return genHandler;
};

var resumeRaw = function resumeRaw(func){
  return Promise.promisify(function(cb){
    var args = slice(arguments);
    args.pop();
    args.push(function(){
      var data = slice(arguments);
      cb(null, data);
    });

    func.apply(ctx, args);
  });
};

var sync = function sync(func){
  return Promise.method(func.bind(ctx));
};

var yieldHandler = function yieldHandler(value){
  if(value && typeof value.then === 'function'){
    return value;
  }

  if(isGeneratorFunction(value)){
    return run(value).call(ctx);
  }

  if(value && typeof value.next === 'function' && typeof value.throw === 'function'){
    var gen = genToGenFunc(value);
    return run(gen).call(ctx);
  }

  if(typeof value === 'function'){
    return Promise.promisify(value, ctx)();
  }

  if(Array.isArray(value)){
    _.forEach(value, function(val, index){
      value[index] = yieldHandler(val);
    });

    return Promise.all(value);
  }

  if(typeof value === 'object'){
    _.forOwn(value, function(val, index){
      value[index] = yieldHandler(val);
    });

    return Promise.props(value);
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
    var fn = co(gen.bind(ctx), {'yieldHandler': yieldHandler})().bind(ctx).cancellable();

    return fn.nodeify(callback);
  };
};

module.exports = {
  'run': run,
  'resume': resume,
  'sync': sync,
  'resumeRaw': resumeRaw,
  'delay': delay
};