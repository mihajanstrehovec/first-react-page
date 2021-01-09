import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import {MikroORM} from "@mikro-orm/core"
import path from "path";

// S pomočjo tega lahko dostopamo do vsega preko cli
export default {
    migrations: {
        // path.join odstrani probleme z runanjem kode v drugih direktorijih. god bless (združi poti)
        path: path.join(__dirname, './migrations'), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    },
    entities: [Post],
    dbName: "first-psql-db",
    user: "postgres",
    password: "statusbaze",
    type: "postgresql",
    debug: !__prod__ ,
} as Parameters<typeof MikroORM.init>[0]; // naredimo type objekta tako, da ustreza tistemu v katerega passamo

