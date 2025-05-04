import Redis from "ioredis"
import dotenv from 'dotenv'

dotenv.config()

const ISPRODUCTION = process.env.ENVIRONMENT == 'PRODUCTION'

const redis = new Redis({
    host:ISPRODUCTION ? 'redis':'localhost',
    port: ISPRODUCTION ? 6379 :6390
});

export default redis

