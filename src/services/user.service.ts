import { db } from '../drizzle/index';
import { userTable } from '../drizzle/schema';
import bcrypt from 'bcrypt';
import { createUserInput } from '../models/userType';
import { v4 as uuidv4 } from "uuid";
export function getUser() {
    return JSON.parse('{"name":"test"}');
}

export async function createUser(userData: createUserInput) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    return db.insert(userTable).values({id: uuidv4(), name: userData.name ,email: userData.email, hashedPassword: hashedPassword}).returning({
        id: userTable.id,
    });
}