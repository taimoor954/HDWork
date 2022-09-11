// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from "@prisma/client"
import { HashPassword } from "../../workers/utils";
export const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    
    
    if (req.method === 'POST') 
      {
  
        let findUserByEmail = await prisma.user.findUnique({ where: { email: req.body.email } })
        if (findUserByEmail) return res.status(400).send({ msg: "User already exist" });
    
        let data = await prisma.user.create({ data: { createdAt: new Date(), email: req.body.email, name: "Taimoor", passord: HashPassword(req.body.password) } })
        return res.status(200).json({ name: data })
    
      }    
  
  
    else {
      return res.status(404).json({ name: 'Not a valid route' })
  
    }
    
  } catch (error) {
    console.log(error)
  }
  
}


// export const prisma = prisma;

/**@NOTE admin id password
   * {
      "email" : "admin@gmail.com",
      "password" : "admin123"
  }
   */