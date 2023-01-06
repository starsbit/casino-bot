import { PrismaClient } from "@prisma/client";
import { singleton } from "tsyringe";
import { logger } from "../utils/logger";

@singleton()
export class DatabaseService {
  private client = new PrismaClient();

  constructor() {}

  public connect = async () => {
    await this.client.$connect().catch((error: Error) => {
      logger.error(error);
      this.disconnect();
    });
  };

  public createUser = async (userId: string) => {
    const user = await this.getUser(userId);
    if (user) return user;
    return this.client.user
      .create({
        data: {
          id: userId,
        },
      })
      .catch((error: Error) => {
        logger.error(error);
      });
  };

  public getUser = async (userId: string) => {
    return this.client.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .catch((error: Error) => {
        logger.error(error);
      });
  };

  public updateUser = async (userId: string, data: { balance: number }) => {
    if (!(await this.getUser(userId))) {
      await this.createUser(userId);
      return;
    }
    await this.client.user
      .update({
        where: {
          id: userId,
        },
        data: data,
      })
      .catch((error: Error) => {
        logger.error(error);
      });
  };

  public disconnect = async () => {
    await this.client.$disconnect().catch((error: Error) => {
      logger.error(error);
      process.exit(1);
    });
  };
}
