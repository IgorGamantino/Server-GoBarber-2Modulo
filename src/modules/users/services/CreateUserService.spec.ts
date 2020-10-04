import AppError from '@shared/Errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakesUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('shoud be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Amantino2',
      email: 'Amantino2@example.com',
      password: '12334',
    });
    expect(user).toHaveProperty('id');
  });

  it('shoud not be able to create a newu user with same email from another', async () => {
    await createUser.execute({
      name: 'Amantino2',
      email: 'Amantino2@example.com',
      password: '12334',
    });
    await expect(
      createUser.execute({
        name: 'Amantino2',
        email: 'Amantino2@example.com',
        password: '12334',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
