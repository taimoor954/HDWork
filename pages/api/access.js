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


   let checkaccess=  await prisma.access.findFirstOrThrow({where : {
        user_id : req.body.user_id,
        projectId : req.body.projectId
    }})

    if(checkaccess) return res.status(400).send({msg : "access already added"})


    await prisma.access.create(
      { data: { projectId: req.body.projectId, user_id: req.body.user_id, permit: req.body.permit, } }
    );

    return res.status(200).json({ msg: "access created" })

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