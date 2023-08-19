import { User, Users } from '../models/user';
import { HttpResourceNotFound } from '../middlewares/error-handling';

export interface NewUser {
  name: string;
  age: number;
  active: boolean;
  email: string | null;
}

export class UserController {
  public async findAll(): Promise<User[]> {
    return Users().select('*');
  }

  public async createUser(newUser: NewUser): Promise<User> {
    const insertedUser: User[] = await Users().insert(newUser).returning('*');
    return insertedUser[0];
  }

  public async findUser(userId: number): Promise<User> {
    const user: User | undefined = await Users().select('*').where('id', userId).first();
    if (!user) {
      throw new HttpResourceNotFound(`user with id ${userId} does not exist`);
    }

    return user;
  }

  public async updateUser(userId: number, newUser: NewUser): Promise<User> {
    const user: User | undefined = await Users().select('*').where('id', userId).first();
    if (!user) {
      throw new HttpResourceNotFound(`user with id ${userId} does not exist`);
    }

    const insertedUser: User[] = await Users().update(newUser).where('id', userId).returning('*');
    return insertedUser[0];
  }

  public async deleteUser(userId: number): Promise<void> {
    const user: User | undefined = await Users().select('*').where('id', userId).first();
    if (!user) {
      throw new HttpResourceNotFound(`user with id ${userId} does not exist`);
    }

    await Users().delete().where('id', userId);
  }
}

export default new UserController();
