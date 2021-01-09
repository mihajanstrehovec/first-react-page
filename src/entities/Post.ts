import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Post { // Table
  @PrimaryKey() // This represents a row
  id!: number;

  @Property({type: 'date'})
  createdAt = new Date();

  @Property({type: 'date', onUpdate: () => new Date() }) // Hook for updating date
  updatedAt = new Date();

  @Property({type: 'text'}) // Type for SQL type in table
  title!: string;


}