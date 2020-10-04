import AppError from '@shared/Errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakesUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('shoud be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Amantino2',
      email: 'Amantino2@example.com',
      password: '12345',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Amantino2');
    expect(profile.email).toBe('Amantino2@example.com');
  });

  it('shoud be able to show the profile from non-existing', async () => {
    await expect(
      showProfile.execute({
        user_id: 'not existing',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
