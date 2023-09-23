import express, { Request, Response } from 'express';
import { FakeopolyError } from '../middlewares/error-handling';

const router = express.Router();

interface IBaseResponse {
  success: boolean;
}

interface IBuyPropertyAction {
  action: 'buy_property';
  playerId: string;
  data: {
    propertyId: number;
    offerAmount: number;
  };
}

interface IBuyPropertyResponse extends IBaseResponse {
  data: {
    propertyId: number;
    newOwnerId: string;
  };
}

interface IRollDiceAction {
  action: 'roll_dice';
  playerId: string;
}

interface IRollDiceResponse extends IBaseResponse {
  data: {
    diceRoll: number;
  };
}

type IAction = IBuyPropertyAction | IRollDiceAction;
// @ts-ignore
type IResponse = IBuyPropertyResponse | IRollDiceResponse;

async function buyProperty(data: IBuyPropertyAction): Promise<IBuyPropertyResponse> {
  if (Number(data.playerId) > 2) {
    throw new FakeopolyError('epic fail');
  }

  return {
    success: true,
    data: {
      propertyId: Math.random() % 50,
      newOwnerId: data.playerId,
    },
  };
}

async function rollDice(data: IRollDiceAction): Promise<IRollDiceResponse> {
  if (Number(data.playerId) > 2) {
    throw new FakeopolyError('epic fail');
  }

  return {
    success: true,
    data: {
      diceRoll: Math.round(Math.random() * 11 + 1),
    },
  };
}

router.post('/action', async (req: Request, res: Response) => {
  const action: IAction = req.body;
  switch (action.action) {
    case 'buy_property':
      return res.json(await buyProperty(action));
    case 'roll_dice':
      return res.json(await rollDice(action));
    default:
      return res.status(422).json({
        message: 'invalid action type',
      });
  }
});

export default router;
