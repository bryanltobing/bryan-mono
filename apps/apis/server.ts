import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import cors from "cors";

import { z } from "zod";

interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

const todos: Todo[] = [{ id: 1, title: "Example Todo", userId: 1, completed: false }];

const createContext = ({ req: _req, res: _res }: trpcExpress.CreateExpressContextOptions) => ({});

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const appRouter = t.router({
  todos: t.procedure.query(() => todos),
  todoCreate: t.procedure
    .input(
      z.object({
        title: z.string(),
      })
    )
    .mutation((req) => {
      const newTodo: Todo = {
        id: Math.random(),
        title: req.input.title,
        completed: false,
        userId: Math.random(),
      };
      todos.push(newTodo);
      return newTodo;
    }),
});

export type AppRouter = typeof appRouter;

const app = express();

app.use(cors());

app.use(
  "/",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
