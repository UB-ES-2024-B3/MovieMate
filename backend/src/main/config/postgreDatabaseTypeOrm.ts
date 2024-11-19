import {DataSource} from "typeorm";
import {env} from "../../config/env";
import {UserEntity} from "../../infrastructure/entities/UserEntity";
import {MovieEntity} from "../../infrastructure/entities/MovieEntity";

let ds;
export const PostgreTypeOrmDataSource = (
    ds = new DataSource({
        type: "postgres",
        host: env.DB_HOST,
        port: Number(env.DB_PORT),
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        entities: [UserEntity, MovieEntity],
        synchronize: true, //en el futuro poner a false para no cargarnos los registros
        logging: ["error"]
    })
)