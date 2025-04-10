import { createClient } from "redis";

const client = createClient({
  url: process.env.REDISURL, // 🔥 Use the service name "redis"
});

client.on("error", (err) => console.log("Redis Client Error", err));

client.connect();

export default client;
