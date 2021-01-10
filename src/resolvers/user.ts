import { User } from '../entities/User'
import { MyContext } from '../types'
import { Resolver,  Mutation, Arg, InputType, Field, Ctx } from 'type-graphql'
import argon2 from "argon2" // Ker ima datoteko .d.ts ne rabimo importat types in tsconfig  => Brez {}, ker uporabljajo default import (const argon2 = require(argon2))


@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@Resolver()
export class UserResolver {
    @Mutation(() => User)
    async register(
        @Arg('options') options: UsernamePasswordInput, // object instead of multiple args
        @Ctx() {em}: MyContext
    ) {
        const hashedPass = await argon2.hash(options.password);
        const user = em.create(User, {
            username: options.username, 
            password: hashedPass})
        await em.persistAndFlush(user)
        return user;
    }
}