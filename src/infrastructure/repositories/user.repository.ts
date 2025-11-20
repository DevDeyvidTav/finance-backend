import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/user/user.repository.interface';
import { User } from '../../domain/user/user.entity';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(this.toDomain);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { googleId } });
    if (!user) return null;
    return this.toDomain(user);
  }

  async save(entity: User): Promise<User> {
    const data = {
      email: entity.email,
      name: entity.name,
      googleId: entity.googleId,
      picture: entity.picture,
    };

    const user = await this.prisma.user.create({ data });
    return this.toDomain(user);
  }

  async update(entity: User): Promise<User> {
    const data = {
      email: entity.email,
      name: entity.name,
      picture: entity.picture,
    };

    const user = await this.prisma.user.update({
      where: { id: entity.id },
      data,
    });
    return this.toDomain(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private toDomain(prismaUser: any): User {
    return User.create(
      {
        email: prismaUser.email,
        name: prismaUser.name,
        googleId: prismaUser.googleId,
        picture: prismaUser.picture,
        createdAt: prismaUser.createdAt,
        updatedAt: prismaUser.updatedAt,
      },
      prismaUser.id,
    );
  }
}


