import { injectable, inject } from 'tsyringe';

import AppError from '../../../shared/Errors/AppError';
import IUserRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  email: string;
  name: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpadateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userWithUpadatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpadatedEmail && userWithUpadatedEmail.id !== user_id) {
      throw new AppError('Email already in use');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Old password not existing');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpadateProfileService;
