// {
//   "phase": "complete",
//   "id": {
//     "value": "a3e1e0b0-cdca-4c77-a68b-fe4619e82553"
//   },
//   "iat": 1701079951,
//   "exp": 1701166351
// }

// import { Jwt } from 'jsonwebtoken';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { getSimpleAuthUsers } from './setupDbForTest';

dotenv.config();

function createToken(phase: string, uuids: string[], expiresInDays: number) {
  const secret = process.env.JWT_SECRET;
  const getPayload = (uuid: string) => ({
    phase,
    id: {
      value: uuid,
    },
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60,
  });

  if (!secret) {
    throw new Error('JWT secret is not defined in .env file');
  }

  return uuids.map((uuid, idx) => ({
    id: idx + 1,
    uuid,
    phase,
    jwt: jwt.sign(getPayload(uuid), secret),
  }));
}

// 예시 사용
const phase = 'complete';
const expiresInDays = 30; // 유효 기간 30일

const testUser = getSimpleAuthUsers(10);
const uuids = testUser.map(({ userId }) => userId);

const token = createToken(phase, uuids, expiresInDays);
console.log(token);
