import AppError from '@shared/Errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakesUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpadateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpadateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpadateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('shoud be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Amantino2',
      email: 'Amantino2@example.com',
      password: '12345',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'AmantinoTest',
      email: 'Amantino@Test.com',
    });

    expect(updatedUser.name).toBe('AmantinoTest');
    expect(updatedUser.email).toBe('Amantino@Test.com');
  });

  it('shoud be able to update the profile from non-existing', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'not existing',
        name: 'TestAmantino',
        email: 'Test@amantino.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shoud not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Amantino2',
      email: 'Amantino2@example.com',
      password: '12345',
    });

    const user = await fakeUsersRepository.create({
      name: 'AmantinoTest',
      email: 'Amantino@Test.com',
      password: '12345',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Amantino2',
        email: 'Amantino2@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shoud be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Amantino2',
      email: 'Amantino2@example.com',
      password: '12345',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'AmantinoTest',
      email: 'Amantino@Test.com',
      old_password: '12345',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('shoud be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Amantino2',
      email: 'Amantino2@example.com',
      password: '12345',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'AmantinoTest',
        email: 'Amantino@Test.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shoud be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Amantino2',
      email: 'Amantino2@example.com',
      password: '12345',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'AmantinoTest',
        email: 'Amantino@Test.com',
        old_password: 'wrong-old password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
