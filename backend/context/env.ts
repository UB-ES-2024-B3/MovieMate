export class EnviromentUtils{
    public static getEnvVar = (variableName: string) => {
        const envVarValue: string | undefined = process.env[variableName];
        if(envVarValue == null) throw Error(`Variable ${variableName} is undefined`);
        return envVarValue;
    }
}