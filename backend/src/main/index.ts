import app from './app';
import {EnviromentUtils} from "../../context/env";
import {PostgreTypeOrmDataSource} from "./config/postgreDatabaseTypeOrm";

async function main() {
    try{
        await PostgreTypeOrmDataSource.initialize();
        const port = EnviromentUtils.getEnvVar('SW_PORT');
        app.listen(port);
        console.log('Server is listening on port', port);
    }
    catch(e){
        console.log(e);
    }
}

main();
