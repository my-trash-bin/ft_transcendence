# ft_transcendence

42cursus ft_transcendence  

Click the image below if you want to see how the assignment works.  
<a href="https://www.youtube.com/watch?v=xtRfaPgWszI">
  <img src="IMG_0323.jpeg" alt="동영상 미리보기" width="700">
</a>


## Usage

See descriptive `Makefile`, or [Production](#production) section.

## Development

This project uses Visual Studio Code as its IDE.

### Frontend

- Write the `project/frontend/.env` file, referring to `project/frontend/.env.sample.dev`.
- Run `npm run dev` in the `project/frontend` directory.

### Backend

- Write the `project/backend/.env` file, referring to `project/backend/.env.sample.dev`.
  - Use `docker/dev` if the database is not configured.
- Ensure the database is set up.
  - Execute `npx prisma migrate deploy && npx ts-node setupDbForTest.ts` in the `project/backend` directory.
- Run `npm run dev` in the `project/backend` directory.

## Production

- Ensure the working tree is clean. (Use `make fclean`)
- Write the `.env` file, referring to `.env.sample`.
- Execute `make`.
