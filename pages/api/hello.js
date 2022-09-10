// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { prisma, PrismaClient } from "@prisma/client"

export default async function handler(req, res) {
  if (req.method === 'GET') {
    console.log('Worked')
    return res.status(200).json({ name: 'John Doe' })

    // Process a POST request
  }

  if (req.method === 'POST') {
    let prisma = new PrismaClient();
    console.log(prisma.user, 'here is user')

    let data = await prisma.user.create({ data: { createdAt: new Date(), email: "taimoormuhammad951@gmail.com", name: "Taimoor" } })
    console.log('Worked')
    return res.status(200).json({ name: data })

    // Process a POST request
  }
  else {
    console.log('NO')
    return res.status(404).json({ name: 'NOt a valid route' })

  }

}
