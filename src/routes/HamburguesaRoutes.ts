import HttpStatusCodes from "@src/common/HttpStatusCodes";

import { IHamburguesa } from "@src/models/Hamburguesa";
import HamburguesaService from "@src/services/HamburguesaService";
import mongoose from "mongoose";
import { IReq, IRes } from "./types/express/misc";

// **** Functions **** //

/**
 * Get all users.
 */
async function get(req: IReq<{ skip: number }>, res: IRes) {
  const skip = parseInt(req.params.skip) || 0;
  const hamburguesas = await HamburguesaService.get(skip);
  return res.status(HttpStatusCodes.OK).json({ hamburguesas });
}

async function getAllByCreatorId(req: IReq, res: IRes) {
  const creatorId = new mongoose.Types.ObjectId(`${req.params.creatorId}`);
  const hamburguesas = await HamburguesaService.getAllByCreatorId(creatorId);
  return res.status(HttpStatusCodes.OK).json({ hamburguesas });
}

async function pageAmount(_: IReq, res: IRes) {
  const amount = await HamburguesaService.pageAmount();
  // Return amount of pages as a number (no json)
  return res.status(HttpStatusCodes.OK).send(`${amount}`);
}

async function add(
  req: IReq<{ hamburguesa: IHamburguesa; token: string }>,
  res: IRes
) {
  const hamburguesa = req.body.hamburguesa;
  const token = req.body.token;
  await HamburguesaService.addOne(hamburguesa, token).then((result) => {
    switch (result) {
      case "hamburguesa ya existe":
        return res
          .status(HttpStatusCodes.CONFLICT)
          .json({ error: "Ya existe" });
      case "Invalid token":
        return res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ error: "No autorizado. Iniciaste sesión?" });
    }
    return res.status(HttpStatusCodes.CREATED).end();
  });
}

/**
 * Update one sanguche.
 */
async function update(
  req: IReq<{ hamburguesa: IHamburguesa; token: string }>,
  res: IRes
) {
  const { hamburguesa: sanguche, token } = req.body;
  await HamburguesaService.updateOne(sanguche, token).then((result) => {
    switch (result) {
      case "Ya hay una hamburguesa igual":
        return res.status(HttpStatusCodes.CONFLICT).json({ error: result });
      case "Token o id invalido":
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ error: result });
      case "Hamburguesa no encontrada":
        return res.status(HttpStatusCodes.NOT_FOUND).json({ error: result });
      case "No tenes permisos para modificar este sanguche":
        return res.status(HttpStatusCodes.FORBIDDEN).json({ error: result });
      case "ok":
        return res.status(HttpStatusCodes.OK).end();
      default:
        return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  });
}

/**
 * Delete one sanguche.
 */
async function delete_(req: IReq<{ token: string }>, res: IRes) {
  const id = new mongoose.Types.ObjectId(`${req.params.id}`);
  const token = req.headers.authorization || "";
  await HamburguesaService.delete(id, token);
  return res.status(HttpStatusCodes.OK).end();
}

async function like(req: IReq<{ token: string }>, res: IRes) {
  const id = new mongoose.Types.ObjectId(`${req.params.id}`);
  const token = req.body.token;
  await HamburguesaService.like(id, token);
  return res.status(HttpStatusCodes.OK).end();
}

// **** Export default **** //

export default {
  pageAmount,
  like,
  getAll: get,
  add,
  update,
  getAllByCreatorId,
  delete: delete_,
} as const;
