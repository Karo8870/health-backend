import { config } from 'dotenv';
import * as process from 'process';

config();

export const jwtConstants = {
	key: process.env.JWT_KEY,
	expiresIn: '365d'
};

export const db_url = process.env.DATABASE_URL;

export const ai_url = process.env.AI_URL;
