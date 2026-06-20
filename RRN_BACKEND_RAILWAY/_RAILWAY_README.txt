RRN BACKEND — RAILWAY DEPLOY  (NOT the website. Do NOT upload these to GitHub.)
==============================================================================
These power the REAL numbers on the bookstore + the radio leaderboard, and the
welcome emails. They go to your backend, then `railway up`.

Project folder:  C:\Users\broch\Downloads\hope-recovery-backend

FILES:
- rrn_books_api.ts.txt  -> rename to books.ts, put in src\routes\, mount at /api/books
- rrn_radio_api.ts.txt   -> rename to radio.ts, put in src\routes\, mount at /api/radio
                            (this is what kills the /api/radio/scores + /board 404s)
- rrn_followup_email.js  -> welcome-email module (setup notes inside the file)

STEPS (PowerShell):
  cd C:\Users\broch\Downloads\hope-recovery-backend
  # rename the two route files:
  #   Rename-Item rrn_books_api.ts.txt books.ts   ; move into src\routes\
  #   Rename-Item rrn_radio_api.ts.txt radio.ts   ; move into src\routes\
  # add the Prisma models shown at the top of each .ts file to prisma\schema.prisma
  npx prisma migrate dev --name book_radio
  npx prisma generate
  # in src\index.ts add:
  #   import booksRouter from "./routes/books";  app.use("/api/books", booksRouter);
  #   import radioRouter from "./routes/radio";  app.use("/api/radio", radioRouter);
  railway up

Each .ts file has full step-by-step setup + raw SQL fallback inside it.
