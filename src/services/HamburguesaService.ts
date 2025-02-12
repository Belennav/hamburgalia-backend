import HttpStatusCodes from "@src/common/HttpStatusCodes";
import RouteError from "@src/common/RouteError";

import { ISanguche } from "@src/models/Hamburguesas";
import SangucheRepo from "@src/repos/HamburguesaRepo";
import mongoose from "mongoose";

// **** Variables **** //

export const SANGUCHE_NOT_FOUND_ERR = "Sanguche not found";

// **** Functions **** //

/**
 * Get all users.
 */
function getAll(): Promise<ISanguche[]> {
  return SangucheRepo.getAll();
}

/**
 * Add one user.
 */
async function addOne(user: ISanguche, token: string): Promise<string> {
  return await SangucheRepo.add(user, token);
}

/**
 * Update one user.
 */
async function updateOne(user: ISanguche, token: string): Promise<string> {
  if (!user._id) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      "User must have an id to update"
    );
  }
  // Return user
  return await SangucheRepo.update(user, token);
}

async function getAllByCreatorId(
  creatorId: mongoose.Types.ObjectId
): Promise<ISanguche[]> {
  return SangucheRepo.getAllByCreatorId(creatorId);
}

/**
 * Delete a user by their id.
 */
async function _delete(
  _id: mongoose.Types.ObjectId,
  token: string
): Promise<void> {
  const persists = await SangucheRepo.persists(_id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, SANGUCHE_NOT_FOUND_ERR);
  }
  // Delete user
  return SangucheRepo.delete(_id, token);
}

// **** Export default **** //

export default {
  getAllByCreatorId,
  getAll,
  addOne,
  updateOne,
  delete: _delete,
} as const;
