import { IHamburguesa } from "@src/models/Hamburguesa";
import UserService from "@src/services/UserService";
import mongoose from "mongoose";
import { HamburguesaModel } from "./Mongoose";
import UserRepo from "./UserRepo";
// **** Functions **** //

/**
 * Get one Hamburguesa.
 */
async function getOne(_id: mongoose.Types.ObjectId): Promise<IHamburguesa | null> {
  return new Promise<IHamburguesa | null>((resolve, reject) => {
    HamburguesaModel.findOne({ _id: _id })
      .then((Hamburguesa: any) => {
        resolve(Hamburguesa);
      })
      .catch((err: Error) => {
        if (err) {
          reject(err);
        }
      });
  });
}

/**
 * See if a Hamburguesa with the given id exists.
 */
async function persists(_id: mongoose.Types.ObjectId): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    HamburguesaModel.findOne({ _id: _id })
      .then((Hamburguesa: any) => {
        if (Hamburguesa) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
      });
  });
}

async function checkNameAndIngredientesUnique(
  Hamburguesa: IHamburguesa
): Promise<boolean> {
  // check if one exists with the same name OR the same ingredients
  return new Promise<boolean>((resolve, reject) => {
    HamburguesaModel.findOne({
      $or: [
        { nombre: Hamburguesa.nombre },
        { ingredientes: { $all: Hamburguesa.ingredientes } },
      ],
    })
      .then((Hamburguesa: any) => {
        if (Hamburguesa) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
      });
  });
}

async function getAllByCreatorId(
  creatorId: mongoose.Types.ObjectId
): Promise<IHamburguesa[]> {
  return new Promise<IHamburguesa[]>((resolve, reject) => {
    HamburguesaModel.find({ creatorId: creatorId })
      .then((Hamburguesas: any) => {
        resolve(Hamburguesas);
      })
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
      });
  });
}

/**
 * Get all Hamburguesas.
 */
async function getAll(): Promise<IHamburguesa[]> {
  return new Promise<IHamburguesa[]>((resolve, reject) => {
    HamburguesaModel.find({})
      .then((Hamburguesas: any) => {
        resolve(Hamburguesas);
      })
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
      });
  });
}

/**
 * Add one Hamburguesa.
 */
async function add(Hamburguesa: IHamburguesa, token: string): Promise<string> {
  const userId = UserService.verifyToken(token);
  if (!userId) {
    return "Invalid token";
  }
  return checkNameAndIngredientesUnique(Hamburguesa)
    .then((res) => {
      if (!res) {
        return "Hamburguesa ya existe";
      }

      Hamburguesa.creatorId = new mongoose.Types.ObjectId(userId);
      return new Promise<string>((resolve, reject) => {
        HamburguesaModel.create(Hamburguesa)
          .then(() => {
            resolve("ok");
          })
          .catch((err: any) => {
            if (err) {
              reject("Error");
            }
          });
      });
    })
    .catch(() => {
      return "Error";
    });
}

/**
 * Update a Hamburguesa.
 */
async function update(newHamburguesa: IHamburguesa, token: string): Promise<string> {
  const userId = UserService.verifyToken(token);
  if (!userId) {
    return "Token Invalido";
  }

  if (!newHamburguesa._id) {
    return "Falta el id del Hamburguesa";
  }

  // get the Hamburguesa
  const Hamburguesa = await getOne(newHamburguesa._id);
  if (!Hamburguesa) {
    return "Hamburguesa no encontrado";
  }

  // check if the user is the creator
  if (Hamburguesa.creatorId.toString() !== userId) {
    // check if the user is admin
    const isAdmin = await UserRepo.checkIfAdmin(
      new mongoose.Types.ObjectId(userId)
    );
    if (!isAdmin) {
      return "No tenes permisos para modificar este Hamburguesa";
    }
  }

  // check if the name or the ingredients are the same
  const isUnique = await checkNameAndIngredientesUnique(newHamburguesa);
  if (!isUnique) {
    return "Ya hay un Hamburguesa igual";
  }

  return HamburguesaModel.updateOne({ _id: newHamburguesa._id }, newHamburguesa)
    .then(() => {
      return "ok";
    })
    .catch((err: any) => {
      return "Error";
    });
}

/**
 * Delete one Hamburguesa.
 */
async function delete_(
  id: mongoose.Types.ObjectId,
  token: string
): Promise<void> {
  const userId = UserService.verifyToken(token);
  // get the Hamburguesa
  const Hamburguesa = await getOne(id);
  if (!Hamburguesa) {
    return Promise.reject("Hamburguesa not found");
  }

  // check if the user is the creator
  if (Hamburguesa.creatorId.toString() !== userId) {
    // check if the user is admin
    const isAdmin = await UserRepo.checkIfAdmin(
      new mongoose.Types.ObjectId(userId)
    );
    if (!isAdmin) {
      return Promise.reject("Unauthorized");
    }
  }

  return new Promise<void>((resolve, reject) => {
    HamburguesaModel.deleteOne({ _id: id })
      .then(() => resolve())
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
  });
}

// **** Export default **** //

export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  getAllByCreatorId,
} as const;
