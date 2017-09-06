var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if(cluster.isMaster) {
  console.log("[master] " + "start master...");

  for(var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('listening', function (worker, address) {
    console.log('listening: worker' + worker.id + ',pid:' + worker.process.pid);
  });

  cluster.on('online', function(work) {
    console.log('Work ' + work.process.pid + 'is online');
  });

  cluster.on('exit', function(worker, code, signal) {
    cluster.fork();
  });
 
} else if (cluster.isWorker) {
  require('./index');
}