import { DeleteProjectOperation, Permission, UpdateProjectOperatoin } from "../../lib/joi";
import { jwtVerify } from "../../workers/utils";
import { prisma } from "./hello";

export default async function handler(req, res) {
  if (req.method === 'GET') {
  
    if (!req.headers.authorization) return res.status(401).send({ msg: 'Send token' })

    let token = req.headers.authorization;

    const decodedData = await jwtVerify(token);

    req.user = decodedData;

    let data = await prisma.access.findMany({ where: { user_id: req.user.userID, permit: { hasEvery: ['READ'] } } })
    if (!data.length) return res.status(400).send({ msg: "No project to access" });

    let projectIds = data.map((accrss) => {
      return accrss.projectId
    })

    let projects = await prisma.project.findMany({ where: { id: { in: [...projectIds] } } })

    return res.status(200).send(projects)
  }

  else if (req.method === 'POST') {

    // if (!req.headers.authorization) return res.status(401).send({ msg: 'Send token' })

    // let token = req.headers.authorization;

    // const decodedData = await jwtVerify(token);

    // req.user = decodedData;

    // let findUserByEmail = await prisma.user.findUnique({ where: { id: req.user.userID } })
    // if (!findUserByEmail) return res.status(400).send({ msg: "Incorrect ID" });

    // if (!findUserByEmail.allow) return res.status(401).send({ msg: "Not allowed to create" });




    // await prisma.project.create(
    //   { data: { createdAt: new Date(), state: req.body.state, name: req.body.projectName, } }
    // );

    // return res.status(200).json({ msg: "project created" })

  }

  else if (req.method == "DELETE") {
    if (!req.headers.authorization) return res.status(401).send({ msg: 'Send token' })

    let token = req.headers.authorization;

    const decodedData = await jwtVerify(token);

    req.user = decodedData;
  
    const payload = {...req.body}
    const validation = DeleteProjectOperation(payload)
    if (validation.errored) return res.status(400).send({ msg: "validation error", errors: validation.errors })

    let data = await prisma.access.findFirst({ where: { user_id: req.user.userID,  permit: { hasEvery: ['DELETE'] }, projectId: req.body.projectId } })
    if (!data) return res.status(400).send({ msg: "No project to access" });

    let responseSent = false;

    await prisma.project.delete({ where: { id: data.projectId } }).catch((e) => {
      responseSent = true
      return res.status(400).send(e)

    });

    await prisma.access.delete({ where: { id: data.id } })
    if (responseSent) return

    return res.status(200).send({ msg: "Delete project" })

  }
  else if (req.method == 'PATCH') {
    if (!req.headers.authorization) return res.status(401).send({ msg: 'Send token' })

    let token = req.headers.authorization;

    const decodedData = await jwtVerify(token);

    req.user = decodedData;
    const payload = {...req.body}
    const validation = UpdateProjectOperatoin(payload)
    if (validation.errored) return res.status(400).send({ msg: "validation error", errors: validation.errors })

    let data = await prisma.access.findFirst({ where: { user_id: req.user.userID, permit: { hasEvery: ['UPDATE'] }, projectId: req.body.projectId } })
    if (!data) return res.status(400).send({ msg: "No project to access" });

    // let responseSent = false;
    await prisma.project.update({where : {id : data.projectId}, data : {name  : req.body.projectName, state : req.body.state
  }})

  return res.status(200).send({msg : "Done with updating"})

  }
  else {
    return res.status(404).json({ name: 'Not a valid route' })

  }

}