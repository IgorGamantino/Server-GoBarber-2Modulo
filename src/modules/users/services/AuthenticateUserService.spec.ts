import AppError from '@shared/Errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakesUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('shoud be able to authenticate', async () => {
    const user = await createUser.execute({
      name: 'Amantino2',
      email: 'Amantino2@example.com',
      password: '12334',
    });

    const response = await authenticateUser.execute({
      email: 'Amantino2@example.com',
      password: '12334',
    });
    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('shoud not be able to authenticate with non existing user', async () => {
    expect(
      authenticateUser.execute({
        email: 'Amantino2@example.com',
        password: '12334',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('shoud not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      name: 'Amantino2',
      email: 'Amantino2@example.com',
      password: '12334',
    });

    expect(
      authenticateUser.execute({
        email: 'Amantino2@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
