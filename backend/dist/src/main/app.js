"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("reflect-metadata");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const openapi_json_1 = __importDefault(require("../../docs/openapi.json"));
const UserRoutes_1 = __importDefault(require("../infrastructure/routes/UserRoutes"));
const MovieRoutes_1 = __importDefault(require("../infrastructure/routes/MovieRoutes"));
const ErrorHandler_1 = __importDefault(require("../infrastructure/config/ErrorHandler"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*',
}));
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi_json_1.default));
app.use("/user", UserRoutes_1.default);
app.use("/movie", MovieRoutes_1.default);
// Este middleware de manejo de errores debe ir al final
app.use(ErrorHandler_1.default);
exports.default = app;
