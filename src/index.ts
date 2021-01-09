import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up(); // Runs migration
    // const post = orm.em.create(Post, {title: 'Second try!'}); // This is just an instance of post
    // await orm.em.persistAndFlush(post);
    //await orm.em.nativeInsert(Post, { title: 'my secoind post, meh.' }); Native insert ne poda created at and updated at, ker je to v Post.ts razredu

    const posts = await orm.em.find(Post, {});

    console.log(posts);


};

// console.log("hell");

main().catch(err => {
    console.log(err);
});