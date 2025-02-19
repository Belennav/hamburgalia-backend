import HttpStatusCodes from "@src/common/HttpStatusCodes";

import { IUser } from "@src/models/User";
import UserService from "@src/services/UserService";
import mongoose from "mongoose";
import { IReq, IRes } from "./types/express/misc";

// **** Functions **** //

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll();
  return res.status(HttpStatusCodes.OK).json({ users });
}

async function login(req: IReq<{ user: IUser }>, res: IRes) {
  const { user } = req.body;
  if (!user.username || !user.password) {
    return res.status(HttpStatusCodes.BAD_REQUEST).end;
  }
  const resp = await UserService.login(user);
  if (!resp) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).end();
  }
  return res.status(HttpStatusCodes.OK).json({ ...resp });
}

/**
 * Add one user.
 */
async function add(req: IReq<{ user: IUser }>, res: IRes) {
  const { user } = req.body;
  if (!user.username || !user.password) {
    return res.status(HttpStatusCodes.BAD_REQUEST).end();
  }
  await UserService.addOne(user);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one user.
 */
async function update(req: IReq<{ user: IUser }>, res: IRes) {
  const { user } = req.body;
  await UserService.updateOne(user);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one user.
 */
async function delete_(req: IReq, res: IRes) {
  const id = +req.params.id;
  await UserService.delete(new mongoose.Types.ObjectId(id));
  return res.status(HttpStatusCodes.OK).end();
}

// **** Export default **** //

export default {
  getAll,
  add,
  login,
  update,
  delete: delete_,
} as const;
