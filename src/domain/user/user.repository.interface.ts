import { IRepository } from '../../shared/domain/repository.interface';
import { User } from './user.entity';

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
}


