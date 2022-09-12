// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { hashPassword, jwtVerify, VerifyHashedPassword } from "../../workers/utils";
import { prisma } from "./hello";
import * as jwt from 'jsonwebtoken'
import { CreateProject } from "../../lib/joi";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    console.log('Worked')
    return res.status(200).json({ name: 'John Doe' })

  }

  if (req.method === 'POST') {

    if (!req.headers.authorization) return res.status(401).send({ msg: 'Send token' })

    let token = req.headers.authorization;

    const decodedData = await jwtVerify(token);

    req.user = decodedData;

    const payload = {...req.body}
    const validation = CreateProject(payload)
    if (validation.errored) return res.status(400).send({ msg: "validation error", errors: validation.errors })


    let findUserByEmail = await prisma.user.findUnique({ where: { id: req.user.userID } })
    if (!findUserByEmail) return res.status(400).send({ msg: "Incorrect ID" });

    if (!findUserByEmail.allow) return res.status(401).send({ msg: "Not allowed to create" });

    


    await prisma.project.create(
      { data: { createdAt: new Date(), state: req.body.state, name: req.body.projectName, } }
    );

    return res.status(200).json({ msg: "project created" })

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