import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

interface GraphQLError {
  message: string;
}

interface GraphQLResponse {
  data?: {
    listUsers?: User[];
    getUser?: User | null;
  };
  errors?: GraphQLError[];
}

describe('Users GraphQL (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('listUsers', () => {
    it('should return all users', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{ listUsers { id name email age } }`,
        })
        .expect(200);

      const body = response.body as GraphQLResponse;
      expect(body.data?.listUsers).toHaveLength(2);
      expect(body.data?.listUsers?.[0]).toEqual({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 20,
      });
    });

    it('should respect the limit argument', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{ listUsers(limit: 1) { id name } }`,
        })
        .expect(200);

      const body = response.body as GraphQLResponse;
      expect(body.data?.listUsers).toHaveLength(1);
      expect(body.data?.listUsers?.[0].id).toBe('1');
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{ getUser(id: "1") { id name email age } }`,
        })
        .expect(200);

      const body = response.body as GraphQLResponse;
      expect(body.data?.getUser).toEqual({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 20,
      });
    });

    it('should return null for a non-existent user', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{ getUser(id: "999") { id name } }`,
        })
        .expect(200);

      const body = response.body as GraphQLResponse;
      expect(body.data?.getUser).toBeNull();
    });
  });

  describe('performance', () => {
    it('should resolve listUsers within 100ms', async () => {
      const start = Date.now();

      await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{ listUsers { id name email age } }`,
        })
        .expect(200);

      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(100);
    });
  });

  describe('security', () => {
    it('should return an error when querying a non-existent field', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{ getUser(id: "1") { id password } }`,
        });

      const body = response.body as GraphQLResponse;
      expect(body.errors).toBeDefined();
      expect(body.errors?.length).toBeGreaterThan(0);
      expect(body.errors?.[0].message).toContain('password');
    });

    it('should return an error for invalid argument type', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `{ listUsers(limit: "abc") { id } }`,
        });

      const body = response.body as GraphQLResponse;
      expect(body.errors).toBeDefined();
      expect(body.errors?.length).toBeGreaterThan(0);
    });
  });
});
