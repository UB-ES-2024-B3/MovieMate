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
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(password),
    'Password'
);

const OptionalString = t.union([t.string, t.undefined, t.null]);

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

    static ReviewDtoInCodec = t.type({
        title: t.string,
        review: t.string,
        author: t.number,
        movie: t.number
    });

    static PostDtoInCodec = t.type({
        title: t.string,
        post: t.string,
        author: t.string
    });


    // Definimos el esquema de validación para el UpdateUserDto
    static UpdateUserDtoCodec = t.type({
        userName: OptionalString,
        password: t.union([Password, t.undefined, t.null]),
        gender: OptionalString,
        description: OptionalString,
        email: t.union([Email, t.undefined, t.null])
    });

    static RecoverPasswordDtoCodec = t.type({
        password: Password,
        confirmPassword: Password
    })


    // Método para validar los datos de la solicitud
    static validateUserDto(data: any) {
        return DtoInValidation.UserDtoInCodec.decode(data);
    }

    static validateReviewDto(data: any) {
        return DtoInValidation.ReviewDtoInCodec.decode(data);
    }

    // Método para validar los datos de la solicitud para UpdateUserDto
    static validateUpdateUserDto(data: any) {
        return DtoInValidation.UpdateUserDtoCodec.decode(data);
    }

    // Método para validar los datos de la solicitud para RecoverPasswordDto
    static validateRecoverPasswordDto(data: any) {
        return DtoInValidation.RecoverPasswordDtoCodec.decode(data);
    }

    static validatePostDto(data: any) {
        return DtoInValidation.PostDtoInCodec.decode(data);
    }
}