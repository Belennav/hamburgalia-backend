import HttpStatusCodes from "@src/common/HttpStatusCodes";
import RouteError from "@src/common/RouteError";

import { IHamburguesa } from "@src/models/Hamburguesa";
import HamburguesaRepo from "@src/repos/HamburguesaRepo";
import mongoose from "mongoose";

// **** Variables **** //

export const Hamburguesa_NOT_FOUND_ERR = "Hamburguesa not found";

// **** Functions **** //

/**
 * Get all users.
 */
function getAll(): Promise<IHamburguesa[]> {
  return HamburguesaRepo.getAll();
}

/**
 * Add one user.
 */
async function addOne(user: IHamburguesa, token: string): Promise<string> {
  return await HamburguesaRepo.add(user, token);
}

/**
 * Update one user.
 */
async function updateOne(user: IHamburguesa, token: string): Promise<string> {
  if (!user._id) {
    throw new RouteError(
      HttpStatusCodes.BAD_REQUEST,
      "User must have an id to update"
    );
  }
  // Return user
  return await HamburguesaRepo.update(user, token);
}

async function getAllByCreatorId(
  creatorId: mongoose.Types.ObjectId
): Promise<IHamburguesa[]> {
  return HamburguesaRepo.getAllByCreatorId(creatorId);
}

/**
 * Delete a user by their id.
 */
async function _delete(
  _id: mongoose.Types.ObjectId,
  token: string
): Promise<void> {
  const persists = await HamburguesaRepo.persists(_id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Hamburguesa_NOT_FOUND_ERR);
  }
  // Delete user
  return HamburguesaRepo.delete(_id, token);
}

// **** Export default **** //

export default {
  getAllByCreatorId,
  getAll,
  addOne,
  updateOne,
  delete: _delete,
} as const;
