import { Entity } from '../../shared/domain/entity.base';
import { randomUUID } from 'crypto';

export interface UserProps {
  email: string;
  name: string;
  googleId: string;
  picture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public static create(props: UserProps, id?: string): User {
    return new User(props, id);
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get googleId(): string {
    return this.props.googleId;
  }

  get picture(): string | undefined {
    return this.props.picture;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  protected generateId(): string {
    return randomUUID();
  }
}


