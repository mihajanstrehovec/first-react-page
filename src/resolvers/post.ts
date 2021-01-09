import { Post } from '../entities/Post';
import { Resolver, Query, Ctx, Arg, Int, Mutation } from 'type-graphql';
import {MyContext} from '../types'


// BASIC CRUD OPERATIONS - CREATE READ UPDATE DELETE
@Resolver()
export class postResolver {

    // Retrieving all post in db
    @Query(() => [Post]) // Need to convert from class defined in Post.ts mikroorm structure to graphQl type
    posts( 
        @Ctx() {em}: MyContext
        ): Promise<Post[]>{
        return em.find(Post, {}); // find returns promise of post
    }

    // Retrieving one post based on id 
    @Query(() => Post, { nullable: true })
    post(
        @Arg("id", () => Int) id: number,
        @Ctx() {em}: MyContext
    ): Promise<Post | null>{
        return em.findOne(Post, {id}); // Needs to be an actual paramater of the schema
    }


    // Creating a post
    @Mutation(() => Post)
    async createPost(
        @Arg("title") title: String,
        @Ctx() {em}: MyContext
    ): Promise<Post | null>{
        const post = em.create(Post, {title});
        await em.persistAndFlush(post);
        return post;
    }

    // Updating a post
    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg("id") id: number,
        @Arg("title", () => String, {nullable: true}) title: String,
        @Ctx() {em}: MyContext
    ): Promise<Post | null>{
        const post = await em.findOne(Post, {id});
        if(!post){
            return null;
        }
        if(typeof title !== 'undefined') {
            post.title = title;
            await em.persistAndFlush(post);
        }
        // const post = em.create(Post, {title});
        return post;
    }

    // Deleting a post
    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number,
        @Ctx() {em}: MyContext
    ): Promise<boolean>{
        await em.nativeDelete(Post, {id});
        return true;
    }

}