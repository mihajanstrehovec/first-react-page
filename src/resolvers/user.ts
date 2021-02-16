import { User } from '../entities/User'
import { MyContext } from '../types'
import { Resolver,  Mutation, Arg, InputType, Field, Ctx, ObjectType } from 'type-graphql'
import argon2 from "argon2" // Ker ima datoteko .d.ts ne rabimo importat types in tsconfig  => Brez {}, ker uporabljajo default import (const argon2 = require(argon2))
// import {sign} from 'jsonwebtoken'
import { MyContextRefreshCokie } from 'src/MyContextRefreshCokie'
import { createAccessToken, createRefreshToken } from '../auth'


@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class FieldError{
    @Field()
    field: string;
    
    @Field()
    message: string;
}

@ObjectType() // we can return object types 
class UserResponse{ // What we are returning on login
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]; // ? => return error if user is not found, return user if it is

    @Field(() => User, {nullable: true})
    user?: User;
}

@ObjectType()
class LoginResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]; // ? => return error if user is not found, return user if it is

    @Field({nullable: true})
    accessToken?: string; 

}


@Resolver()
export class userResolver {
    // Registration
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput, // object instead of multiple args
        @Ctx() {em}: MyContext
    ):Promise <UserResponse> {
        if(options.username.length <= 2){
            return{
                errors: [{
                    field: "username",
                    message: "username too short"
                }
            ],
            };
        }

        if(options.password.length <= 3){
            return{
                errors: [{
                    field: "password",
                    message: "password must be longer than 3 characters"
                }
            ],
            };
        }
        const hashedPass = await argon2.hash(options.password);
        const user = em.create(User, {
            username: options.username, 
            password: hashedPass
        });
        try{
            await em.persistAndFlush(user)
        } catch(err) { 
            if(err.code === "23505" || err.detail.includes("already exists")){
                // Duplicate username err
                return{
                    errors: [{
                        field: "username",
                        message: "username already taken"
                    }],
                };
            }
            console.log("msg:", err.message);
        }
        return {
            user
        };
   
    }


    // Login
    @Mutation(() => LoginResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput, // object instead of multiple args
        @Ctx() {em}: MyContext,
        @Ctx() {res}: MyContextRefreshCokie
    ): Promise <LoginResponse> {
        const user = await em.findOne(User, {username: options.username});
        if(!user){ // handling errors
            return{
                errors: [
                    {
                    field: "username",
                    message: "username doesn't exist"
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, options.password);
        if(!valid){
            return{
                errors: [
                    {
                    field: "password",
                    message: "wrong password"
                    },
                ],
            };
        }

        // Login succesfull

        res.cookie(
            'jid',  
            createRefreshToken(user), // Funkcija za kreacijo piškotka, ki se nahaja v ./src/auth.ts
            {
                httpOnly: true
            }
        );

        return {
            accessToken: createAccessToken(user) // Funkcija za kreacijo access tokena, ki se nahaja v ./src/auth.ts
        };
    }
}