import AppError from '@shared/Errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakesUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendoForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendoForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('shoud be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Amantino2',
      email: 'Amantino2@example.com',
      password: '12334',
    });

    await sendoForgotPasswordEmail.execute({
      email: 'Amantino2@example.com',
    });
    expect(sendMail).toHaveBeenCalled();
  });

  it('shoud not be able to recover a non-existing user password', async () => {
    await expect(
      sendoForgotPasswordEmail.execute({
        email: 'Amantino2@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shoud generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Amantino2',
      email: 'Amantino2@example.com',
      password: '12334',
    });

    await sendoForgotPasswordEmail.execute({
      email: 'Amantino2@example.com',
    });
    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
