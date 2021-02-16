import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql'
import { helloResolver } from "./resolvers/hello";
import { postResolver } from "./resolvers/post";
import { userResolver } from "./resolvers/user";
import "dotenv/config"

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up(); // Runs migration
    
    // const post = orm.em.create(Post, {title: 'Second try!'}); // This is just an instance of post
    // await orm.em.persistAndFlush(post);
    //await orm.em.nativeInsert(Post, { title: 'my secoind post, meh.' }); Native insert ne poda created at and updated at, ker je to v Post.ts razredu
    // const posts = await orm.em.find(Post, {});
    // console.log(posts);

    const app = express(); // Express app

    

    // Creating an end point for graphql on our express server
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [helloResolver, postResolver, userResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ // Object that is accessible to all resolvers
            em: orm.em,
            req,
            res
        }) 
        
        
    });

    apolloServer.applyMiddleware({ app });


    app.listen(4000, () => {
        console.log('server started on localhost:4000');
    });




};

// console.log("hell");



main().catch(err => {
    console.log(err);
    
});