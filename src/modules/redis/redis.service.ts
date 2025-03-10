import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379", // Use env variable
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 500, 3000), // Retry logic
      },
    });
    this.client.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      console.log("Redis Connected Successfully");
    } catch (error) {
      console.error("Redis Connection Failed:", error);
    }
  }

  async setOTP(identifier: string, otp: string, ttl: number = 300) {
    try {
      await this.client.set(identifier, otp, { EX: ttl }); // OTP expires in 5 mins
      console.log(`OTP set for ${identifier}`);
    } catch (error) {
      console.error("Redis SET Error:", error);
    }
  }

  async getOTP(identifier: string): Promise<string | null> {
    try {
      return await this.client.get(identifier);
    } catch (error) {
      console.error("Redis GET Error:", error);
      return null;
    }
  }

  async deleteOTP(identifier: string) {
    try {
      await this.client.del(identifier);
      console.log(`OTP deleted for ${identifier}`);
    } catch (error) {
      console.error(" Redis DELETE Error:", error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
      console.log("Redis Client Disconnected");
    } catch (error) {
      console.error("Redis Disconnection Error:", error);
    }
  }
}
