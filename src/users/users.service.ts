import { Injectable } from '@nestjs/common';
import { User } from './user';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', age: 20 },
    { id: '2', name: 'Jane Doe', email: 'jane.doe@example.com', age: 21 },
  ];

  getUser(id: string): User | null {
    return this.users.find((user) => user.id === id) ?? null;
  }

  listUsers(limit?: number): User[] {
    return this.users.slice(0, limit ?? this.users.length);
  }
}
