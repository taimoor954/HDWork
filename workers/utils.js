
import pbkdf2 from "pbkdf2";
import * as jwt from "jsonwebtoken";

const salt = process.env.SALT

export function HashPassword(password) {

    let hash = pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha256')
    return hash.toString('hex')
}

export function VerifyHashedPassword(password, original) {

    let hash = pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha256').toString('hex')

    return (hash === original) ? true : false;

}


// const bcrypt = require("bcryptjs");



export async function jwtVerify  (token)  {
  const userData =  jwt.verify(
    token,
    process.env.SECRET_KEY
  );
  return userData;
}