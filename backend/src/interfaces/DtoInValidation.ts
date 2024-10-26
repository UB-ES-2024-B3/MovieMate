import * as t from 'io-ts';
import {autoInjectable} from "tsyringe";

// Validación de email usando regex directamente en la declaración de tipo
const Email = t.brand(
    t.string,
    (email): email is t.Branded<string, { readonly Email: unique symbol }> =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    'Email'
);

// Validación de contraseña usando regex directamente en la declaración de tipo
const Password = t.brand(
    t.string,
    (password): password is t.Branded<string, { readonly Password: unique symbol }> =>
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password),
    'Password'
);

@autoInjectable()
export class DtoInValidation {
    // Definimos el esquema de validación para el UserDtoIn
    static UserDtoInCodec = t.type({
        userName: t.string,
        password: Password,
        email: Email,
        birthDate: t.string,  // Podemos validar esto tambien para que se mande en el mismo formato siempre
        gender: t.string,
        isAdmin: t.union([t.boolean, t.undefined])
    });


    // Método para validar los datos de la solicitud
    static validateUserDto(data: any) {
        return DtoInValidation.UserDtoInCodec.decode(data);
    }
}