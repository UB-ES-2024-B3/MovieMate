import {DataSource} from "typeorm";
import {env} from "../../config/env";

let ds;
export const PostgreTypeOrmDataSource = (
    ds = new DataSource({
        type: "postgres",
        host: env.DB_HOST,
        port: Number(env.DB_PORT),
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        entities: [],
        synchronize: true, //en el futuro poner a false para no cargarnos los registros
        logging: ["error"]
    })
)