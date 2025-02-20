import HttpStatusCodes from "@src/common/HttpStatusCodes";
import RouteError from "@src/common/RouteError";
import jwt from "jsonwebtoken";

import EnvVars from "@src/common/EnvVars";
import { IUser } from "@src/models/User";
import UserRepo from "@src/repos/UserRepo";
import mongoose from "mongoose";

// **** Variables **** //

export const USER_NOT_FOUND_ERR = "User not found";

// **** Functions **** //

/**
 * Get all users.
 */
function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

/**
 * Add one user.
 */
function addOne(user: IUser): Promise<void> {
  return UserRepo.add(user);
}

async function login(
  user: IUser
): Promise<{ token: string; id: string; isAdmin: boolean } | null> {
  return await UserRepo.login(user).then((ok) => {
    if (ok.id == "") {
      return null;
    }
    return {
      token: generateAccessToken(ok.id),
      id: ok.id,
      isAdmin: ok.isAdmin,
    };
  });
}

/**
 * Update one user.
 */
async function updateOne(user: IUser): Promise<void> {
  const persists = await UserRepo.persists(user._id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }
  // Return user
  return UserRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: mongoose.Types.ObjectId): Promise<void> {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }
  // Delete user
  return UserRepo.delete(id);
}

function generateAccessToken(userId: string): string {
  return jwt.sign({ userId }, EnvVars.Jwt.Secret, { expiresIn: "1d" });
}

function verifyToken(token: string): string {
  // extract userId from token else return empty string
  try {
    return (jwt.verify(token, EnvVars.Jwt.Secret) as { userId: string }).userId;
  } catch (err) {
    return "";
  }
}
// **** Export default **** //

export default {
  getAll,
  addOne,
  login,
  updateOne,
  verifyToken,
  delete: _delete,
} as const;
