import { Router } from "express";
import jetValidator from "jet-validator";

import User from "@src/models/User";
import Paths from "../common/Paths";
import HamburguesaRoutes from "./HamburguesaRoutes";
import UserRoutes from "./UserRoutes";

// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();

// ** Add UserRouter ** //

const userRouter = Router();
const hamburguesaRouter = Router();

// Get all users
userRouter.get(Paths.Users.Get, UserRoutes.getAll);

hamburguesaRouter.get(
  Paths.Hamburguesas.PageAmount,
  HamburguesaRoutes.pageAmount
);
hamburguesaRouter.get(Paths.Hamburguesas.Get, HamburguesaRoutes.getAll);
userRouter.post(
  Paths.Users.Login,
  validate(["user", () => true]),
  UserRoutes.login
);
// Add one user
userRouter.post(
  Paths.Users.Add,
  validate(["user", User.isUser]),
  UserRoutes.add
);

hamburguesaRouter.post(Paths.Hamburguesas.Add, HamburguesaRoutes.add);

// Update one user
userRouter.put(
  Paths.Users.Update,
  validate(["user", User.isUser]),
  UserRoutes.update
);

hamburguesaRouter.put(Paths.Hamburguesas.Like, HamburguesaRoutes.like);

hamburguesaRouter.put(Paths.Hamburguesas.Update, HamburguesaRoutes.update);

// Delete one user
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);

hamburguesaRouter.delete(Paths.Hamburguesas.Delete, HamburguesaRoutes.delete);

hamburguesaRouter.get(
  Paths.Hamburguesas.GetAllByCreatorId,
  validate(["creatorId", "string", "params"]),
  HamburguesaRoutes.getAllByCreatorId
);

// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter);
apiRouter.use(Paths.Hamburguesas.Base, hamburguesaRouter);

// **** Export default **** //

export default apiRouter;
