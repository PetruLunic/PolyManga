import Redis from "ioredis";

const redis = new Redis({
  password: "uVidTINblvZJCjmFk2qqjeejROwC6ioh",
  host: 'redis-19169.c293.eu-central-1-1.ec2.redns.redis-cloud.com',
  port: 19169
});

export default redis;