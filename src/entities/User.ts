import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType() // converting for graph ql usage
@Entity()
export class User { // Table
  
    @Field() // GraphQl type, we can not include some of the values or set their type
    @PrimaryKey() // This represents a row
    id!: number;

    @Field(() => String)
    @Property({type: 'date'})
    createdAt = new Date();

    @Field(() => String)
    @Property({type: 'date', onUpdate: () => new Date() }) // Hook for updating date
    updatedAt = new Date();

    @Field()
    @Property({type: 'text', unique: true}) // Type for SQL type in table
    username!: string;


    @Property({type: 'text'}) // Type for SQL type in table
    password!: string;

}