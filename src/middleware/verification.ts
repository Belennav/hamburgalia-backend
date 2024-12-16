import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IReq, IRes } from '@src/routes/types/express/misc';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import EnvVars from '@src/common/EnvVars';

export function verifyToken(req: IReq<{decoded: any}>, res: IRes, next: NextFunction): any {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(HttpStatusCodes.FORBIDDEN).send({ auth: false, message: 'No token provided.' });
    }
    
    jwt.verify(token.toString(), EnvVars.Jwt.Secret, (err: any, decoded: any) => {
        if (err) {
        return res.status(HttpStatusCodes.UNAUTHORIZED).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        req.body.decoded = decoded;
        next();
    });
    }