import HttpStatusCodes from "@src/common/HttpStatusCodes";

import { IHamburguesa } from "@src/models/Hamburguesas";
import HamburguesaService from "@src/services/HamburguesaService";
import mongoose from "mongoose";
import { IReq, IRes } from "./types/express/misc";

// **** Functions **** //

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const hamburguesas = await HamburguesaService.getAll();
  return res.status(HttpStatusCodes.OK).json({ hamburguesas });
}

async function getAllByCreatorId(req: IReq, res: IRes) {
  const creatorId = new mongoose.Types.ObjectId(`${req.params.creatorId}`);
  const hamburguesas = await HamburguesaService.getAllByCreatorId(creatorId);
  return res.status(HttpStatusCodes.OK).json({ hamburguesas });
}

/**
 * Add one hamburguesa.
 */
async function add(
  req: IReq<{ hamburguesa: IHamburguesa; token: string }>,
  res: IRes
) {
  const hamburguesa = req.body.hamburguesa;
  const token = req.body.token;
  await HamburguesaService.addOne(hamburguesa, token).then((result) => {
    switch (result) {
      case "hamburguesa ya existe":
        return res.status(HttpStatusCodes.CONFLICT).json({ error: result });
      case "Invalid token":
        return res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: result });
    }
    return res.status(HttpStatusCodes.CREATED).end();
  });
}

/**
 * Update one hamburguesa.
 */
async function update(
  req: IReq<{ hamburguesa: IHamburguesa; token: string }>,
  res: IRes
) {
  const { hamburguesa, token } = req.body;
  await HamburguesaService.updateOne(hamburguesa, token).then((result) => {
    switch (result) {
      case "Ya hay un hamburguesa igual":
        return res.status(HttpStatusCodes.CONFLICT).json({ error: result });
      case "Token o id invalido":
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: result });
      case "hamburguesa no encontrado":
        return res.status(HttpStatusCodes.NOT_FOUND).json({ error: result });
      case "No tenes permisos para modificar este hamburguesa":
        return res.status(HttpStatusCodes.FORBIDDEN).json({ error: result });
      case "ok":
        return res.status(HttpStatusCodes.OK).end();
      default:
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  });
}

/**
 * Delete one hamburguesa.
 */
async function delete_(req: IReq<{ token: string }>, res: IRes) {
  const id = new mongoose.Types.ObjectId(`${req.params.id}`);
  const token = req.headers.authorization || "";
  await HamburguesaService.delete(id, token);
  return res.status(HttpStatusCodes.OK).end();
}

// **** Export default **** //

export default {
  getAll,
  add,
  update,
  getAllByCreatorId,
  delete: delete_,
} as const;
