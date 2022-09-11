// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { hashPassword, jwtVerify, VerifyHashedPassword } from "../../workers/utils";
import { prisma } from "./hello";
import * as jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    console.log('Worked')
    return res.status(200).json({ name: 'John Doe' })

  }
  
  if (req.method === 'POST') {
    
    if(!req.headers.authorization) return res.status(401).send({msg : 'Send token'})

    let token = req.headers.authorization;
    
    const decodedData = await jwtVerify(token);
    req.user = decodedData;
    if(req.user.role != 'ADMIN') return res.status(401).send({msg : "Not allowed to use this api"})

    let findUserByEmail = await prisma.user.findUnique({ where: { id: req.body.userID } })
    if (!findUserByEmail) return res.status(400).send({ msg: "Incorrect ID" });


    await prisma.user.update({
        where : 
        {id : req.body.userID},
        data : {allow : req.body.allow}});
    
    return res.status(200).json({ msg:"user updated" })
    
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