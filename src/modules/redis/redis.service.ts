import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);

  constructor() {
    this.client = createClient({
      url: `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      socket: {
        tls: true, // Upstash requires TLS
        reconnectStrategy: (retries) => Math.min(retries * 500, 3000), // Retry logic
      },
      
    });

    this.client.on("error", (err) => {
      this.logger.error("❌ Redis Client Error:", err);
    });

    this.client.on("connect", () => {
      this.logger.log("✅ Redis Connected Successfully");
    });

    this.client.on("reconnecting", () => {
      this.logger.warn("♻️ Redis Reconnecting...");
    });

    this.client.on("end", () => {
      this.logger.warn("🔴 Redis Connection Closed");
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.connect();
      this.logger.log("🚀 Redis Connection Established");
    } catch (error) {
      this.logger.error("Redis Connection Failed:", error);
    }
  }

  async setOTP(identifier: string, otp: string, ttl: number = 600): Promise<boolean> {
    try {
      const result = await this.client.set(identifier, otp, { EX: ttl });
  
      if (result !== "OK") {
        this.logger.error(`Failed to store OTP for ${identifier}`);
        return false; //Return false if storing OTP fails
      }
  
      this.logger.log(`OTP set for ${identifier}`);
      return true; // Return true if successful
  
    } catch (error) {
      this.logger.error("Redis SET Error:", error);
      return false; //Return false if an exception occurs
    }
  }
  
  

  async getOTP(identifier: string): Promise<string | null> {
    try {
      const otp = await this.client.get(identifier);
      if (!otp) {
        this.logger.warn(` OTP not found for identifier: ${identifier}`);
      }
      return otp;
    } catch (error) {
      this.logger.error(" Redis GET Error:", error);
      return null;
    }
  }

  async deleteOTP(identifier: string): Promise<void> {
    try {
      await this.client.del(identifier);
      this.logger.log(` OTP deleted for identifier: ${identifier}`);
    } catch (error) {
      this.logger.error(" Redis DELETE Error:", error);
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.client.quit();
      this.logger.log(" Redis Client Disconnected");
    } catch (error) {
      this.logger.error(" Redis Disconnection Error:", error);
    }
  }
}
