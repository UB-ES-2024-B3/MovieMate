import {NextFunction, Request, Response, Router} from "express";
import {UserController} from "../controllers/UserController";

const router = Router();

router.put('/update/:userId', (req: Request, res: Response, next: NextFunction) => {

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'User update data.',
        schema: { $ref: '#/definitions/UpdateUser' }
    } */

    UserController.updateUser(req, res, next)
 });
router.get("/search", (req: Request, res: Response, next: NextFunction) => UserController.searchUsers(req, res, next));
router.delete("/:userName", (req: Request, res: Response, next: NextFunction) => UserController.deleteUser(req, res, next));
router.get("/:userName", (req: Request, res: Response, next: NextFunction) => UserController.getUser(req, res, next));
router.post("/register", (req: Request, res: Response, next: NextFunction) => {
    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'User data.',
        required: true,
        schema: { $ref: '#/definitions/CreateUser' }
    } */
    UserController.registerUser(req, res, next);
});
router.post("/login", (req: Request, res: Response, next: NextFunction)=> UserController.loginUser(req, res, next));
router.post("/requestPasswordRecovery", (req: Request, res: Response, next: NextFunction) => UserController.sendRecoveryEmail(req, res, next));
router.put("/passwordRecovery", (req: Request, res: Response, next: NextFunction) => UserController.recoverPassword(req, res, next));


export default router;