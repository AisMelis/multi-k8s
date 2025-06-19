console.log('Worker process started');

const keys = require('./keys');
console.log('Redis host:', keys.redisHost);
console.log('Redis port:', keys.redisPort);
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
console.log('Redis client created');

const sub = redisClient.duplicate();
console.log('Subscriber client duplicated');

// Logging for connection events
redisClient.on('connect', () =>{
  console.log('Worker connected to Redis');
});
redisClient.on('error', (err) => {
  console.log('Redis client error: ', err);
});
sub.on('error', (err) => {
  console.log('Redis subscriber error: ', err);
});

sub.on('message', (channel, message) => {
  console.log(`Received message on ${channel}: ${message}`);
  const result = fib(parseInt(message));
  console.log(`Calculated fib(${message}) = ${result}`);
  redisClient.hset('values', message, result);
});
sub.subscribe('insert', (err, count) => {
  if (err){
    console.log('Failed to subscribe:', err);
  } else {
    console.log(`Successfully subscribed to insert (${count} сhannels)`);
  }
});

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}
