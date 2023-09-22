import {verify} from 'jsonwebtoken'

export const verifyToken = (token: string) => {
  if(!process.env.SECRET_KEY_AC) return null
  return verify(token, process.env.SECRET_KEY_AC)
}