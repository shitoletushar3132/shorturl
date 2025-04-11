import { createClient } from "redis";

const client = createClient({
  url: "redis://redis:6379", // 🔥 Use the service name "redis"
});

client.on("error", (err) => console.log("Redis Client Error", err));

client.connect();

export default client;
