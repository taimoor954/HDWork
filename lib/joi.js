import Joi, { func } from "joi";

  export function SignUpValidator(data) {
    let schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      password: Joi.string().required().min(8).max(50),
      email: Joi.string().email().required(),
    });
    let result = schema.validate(data, { abortEarly: false });
    if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
    else return { errored: false, errors: null, value: result.value }
  }

  
 export function LoginValidator(data) {
    let schema = Joi.object({
      password: Joi.string().required(),
      email: Joi.string().email().required(),
    });
    let result = schema.validate(data, { abortEarly: false });
    if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
    else return { errored: false, errors: null, value: result.value }
  }


  export function Permission(data)
  {
    let schema = Joi.object({
        userID: Joi.number().required(),
        allow: Joi.boolean().required(),
      });
      let result = schema.validate(data, { abortEarly: false });
      if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
      else return { errored: false, errors: null, value: result.value }
   
  }

  export function AccessValidation(data)
  {
    let schema = Joi.object({
        user_id: Joi.number().required(),
        projectId: Joi.number().required(),
        permit : Joi.array().items(Joi.string().valid("CREATE", "READ", "DELETE", "UPDATE"))


      });
      let result = schema.validate(data, { abortEarly: false });
      if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
      else return { errored: false, errors: null, value: result.value }
   
  }


  export function DeleteProjectOperation(data)
  {
    let schema = Joi.object({
        projectId: Joi.number().required(),


      });
      let result = schema.validate(data, { abortEarly: false });
      if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
      else return { errored: false, errors: null, value: result.value }
   
  }


  export function UpdateProjectOperatoin(data)
  {
    let schema = Joi.object({
        projectId: Joi.number().required(),
        state : Joi.string().required().valid("OPEN", "CLOSE","PROPOSE"),
        projectName : Joi.string().required()
      });
      let result = schema.validate(data, { abortEarly: false });
      if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
      else return { errored: false, errors: null, value: result.value }
   
  }
  export function CreateProject(data)
  {
    let schema = Joi.object({
        state : Joi.string().required().valid("OPEN", "CLOSE","PROPOSE"),
        projectName : Joi.string().required()
      });
      let result = schema.validate(data, { abortEarly: false });
      if (result.error) return { errored: true, errors: result.error.message.split('.'), value: result.value }
      else return { errored: false, errors: null, value: result.value }
   
  }

