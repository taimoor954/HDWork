// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { hashPassword, VerifyHashedPassword } from "../../workers/utils";
import { prisma } from "./hello";
import * as jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    console.log('Worked')
    return res.status(200).json({ name: 'John Doe' })

  }
  
  if (req.method === 'POST') {
    
    let findUserByEmail = await prisma.user.findUnique({ where: { email: req.body.email } })
    if (!findUserByEmail) return res.status(400).send({ msg: "Incorrect email or password" });


   const passwordVerification = VerifyHashedPassword( req.body.password,findUserByEmail.passord)
    if (!passwordVerification) return res.status(400).send({ msg: "Email or password is incorrect" })

    delete findUserByEmail.passord
    const payload = {
      userID: findUserByEmail.id,
      email: findUserByEmail.email,
      role: findUserByEmail.role
    };

    const jwtToken = jwt.sign(payload, process.env.SECRET_KEY);

    // let data = await prisma.user.create({ data: { createdAt: new Date(), email: req.body.email, name: "Taimoor", passord: hashPassword(req.body.password), role: "ADMIN" } })
    return res.status(200).json({ name: findUserByEmail, jwtToken })
    
  }
  else {
    return res.status(404).json({ name: 'Not a valid route' })

  }

}

/**@NOTE admin id password
   * {
      "email" : "admin@gmail.com",
      "password" : "admin123"
  }
   */