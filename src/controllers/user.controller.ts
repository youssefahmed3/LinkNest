import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { CreateUserSchemaInput } from '../models/userType';


export async function getUser(req: any, res: any) {
    const user = await userService.getUser();
    res.send(user);
}


export async function createUser(req: any, res: any) {
    const parseResult = CreateUserSchemaInput.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.format() });
    }

    const userData = parseResult.data;

    const user = await userService.createUser(userData);

    res.status(201).json({ message: "User created", user });
}