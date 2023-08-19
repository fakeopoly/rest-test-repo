import express, { Request, Response } from 'express';
import userController, { NewUser } from '../controllers/user.controller';
import { validatedBody } from '../middlewares/validation';
import { body, ValidationChain } from 'express-validator';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  return res.status(200).json({
    users: await userController.findAll(),
  });
});

// prettier-ignore
const newUserValidation: ValidationChain[] = [
  body('name')
    .isString().withMessage('must be string')
    .notEmpty().withMessage('cannot be empty')
    .isLength({max: 100}).withMessage('max length is 100'),
  body('age')
    .isInt({min: 0, max: 150}).withMessage('must be int [0,150]'),
  body('active')
    .isBoolean().withMessage('must be bool')
    .notEmpty().withMessage('cannot be empty'),
  body('email')
    .isEmail().withMessage('must be valid email address')
    .notEmpty().withMessage('cannot be empty')
    .isLength({max: 100}).withMessage('max length is 100')
    .optional(),
];

router.post('/', newUserValidation, async (req: Request, res: Response) => {
  const body = validatedBody<NewUser>(req);
  return res.status(201).json({
    user: await userController.createUser(body),
  });
});

router.get('/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  return res.status(200).json({
    user: await userController.findUser(userId),
  });
});

router.put('/:userId', newUserValidation, async (req: Request, res: Response) => {
  const body = validatedBody<NewUser>(req);
  const userId = Number(req.params.userId);
  return res.status(200).json({
    user: await userController.updateUser(userId, body),
  });
});

router.delete('/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  await userController.deleteUser(userId);
  return res.status(204).end();
});

export default router;
