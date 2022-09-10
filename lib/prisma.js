// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

let prisma;

if (process.env.NODE_ENV === 'development') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}
console.log('here is prisma', prisma)
export default prisma;
