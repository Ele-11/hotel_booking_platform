import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
// import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  // extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // super({
    //   log: ["query", "info", "warn", "error"],
    // });
  }

  async onModuleInit() {
    // await this.$connect();
  }

  async onModuleDestroy() {
    // await this.$disconnect();
  }

  /**
   * 软删除扩展
   */
  // get extended() {
  //   return this.$extends({
  //     query: {
  //       async delete({ model, args }) {
  //         return this[model].update({
  //           ...args,
  //           data: { deletedAt: new Date() },
  //         });
  //       },
  //       async deleteMany({ model, args }) {
  //         return this[model].updateMany({
  //           ...args,
  //           data: { deletedAt: new Date() },
  //         });
  //       },
  //     },
  //   });
  // }
}