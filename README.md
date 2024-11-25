## Instructions

### Setup

1. Run `docker-compose up -d` to start the MySQL database.
2. Run `npm install` to install dependencies.
3. Run `npx prisma generate` to generate the Prisma Client.
4. Run `npx prisma db push` to create and sync the database schema.

### Development

- (Optional) Use `npm run dev` to start the server for development with hot reload
- Use `npm run build` to compile TypeScript
- Use `npm start` to run the compiled version

### Testing (Optional)

1. Run `npm test` to run tests
2. Run `npm run test:watch` for development testing

### Database (Optional)

- Use `npx prisma studio` to view and edit the database
- Use `npx prisma format` to format the schema file
- Use `npx prisma validate` to validate the schema

### Environment Variables (for production)

Make sure to set up your `.env` file with:

```env
DATABASE_URL="mysql://root:password@localhost:3306/tasks"

There is also a .env.test file for testing purposes.
The .env.test file contains:
```

```
DATABASE_URL="mysql://root:test@localhost:3307/tasks_test"
```
