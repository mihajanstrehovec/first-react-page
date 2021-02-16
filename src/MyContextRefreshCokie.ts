import { Request, Response } from "express"

export interface MyContextRefreshCokie {
    req: Request;
    res: Response;
    payload?: {userId: string};
}