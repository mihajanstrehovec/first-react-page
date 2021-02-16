import { verify } from "jsonwebtoken"
import { MiddlewareFn } from "type-graphql"
import { MyContextRefreshCokie } from "./MyContextRefreshCokie"

// bearer 12312k3ohioghiodbfsdf01

export const isAuth : MiddlewareFn <MyContextRefreshCokie> = ({context}, next) => { // As many middlewears as we want before query
    
    const authorization = context.req.headers['authorization']
    
    if(!authorization){
        throw new Error("not authenticated");
    }

    try{
        
        const token = authorization.split(' ')[1]; 
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        context.payload = payload as any; // s tem omogočimo dostop do id-ja v resolverju

    } catch(err) {
        
        console.log(err);
        throw new Error("not authenticated");
    
    }

    return next()
    
}