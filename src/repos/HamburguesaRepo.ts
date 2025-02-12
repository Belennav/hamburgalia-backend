import { IHamburguesa } from "@src/models/Hamburguesas";
import UserService from "@src/services/UserService";
import mongoose from "mongoose";
import { HamburguesaModel} from "./Mongoose";
import UserRepo from "./UserRepo";
// **** Functions **** //

/**
 * Get one hamburguesa.
 */
async function getOne(_id: mongoose.Types.ObjectId): Promise<IHamburguesa | null> {
  return new Promise<IHamburguesa | null>((resolve, reject) => {
    HamburguesaModel.findOne({ _id: _id })
      .then((hamburguesa: any) => {
        resolve(hamburguesa);
      })
      .catch((err: Error) => {
        if (err) {
          reject(err);
        }
      });
  });
}

/**
 * See if a hamburguesa with the given id exists.
 */
async function persists(_id: mongoose.Types.ObjectId): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    HamburguesaModel.findOne({ _id: _id })
      .then((hamburguesa: any) => {
        if (hamburguesa) {
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
  hamburguesa: IHamburguesa
): Promise<boolean> {
  // check if one exists with the same name OR the same ingredients
  return new Promise<boolean>((resolve, reject) => {
    HamburguesaModel.findOne({
      $or: [
        { nombre: hamburguesa.nombre },
        { ingredientes: { $all: hamburguesa.ingredientes } },
      ],
    })
      .then((hamburguesa: any) => {
        if (hamburguesa) {
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
      .then((hamburguesas: any) => {
        resolve(hamburguesas);
      })
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
      });
  });
}

/**
 * Get all hamburguesas.
 */
async function getAll(): Promise<IHamburguesa[]> {
  return new Promise<IHamburguesa[]>((resolve, reject) => {
    HamburguesaModel.find({})
      .then((hamburguesas: any) => {
        resolve(hamburguesas);
      })
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
      });
  });
}

/**
 * Add one hamburguesa.
 */
async function add(hamburguesa: IHamburguesa, token: string): Promise<string> {
  const userId = UserService.verifyToken(token);
  if (!userId) {
    return "Invalid token";
  }
  return checkNameAndIngredientesUnique(hamburguesa)
    .then((res) => {
      if (!res) {
        return "Hamburguesa ya existe";
      }

      hamburguesa.creatorId = new mongoose.Types.ObjectId(userId);
      return new Promise<string>((resolve, reject) => {
        HamburguesaModel.create(hamburguesa)
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
 * Update a hamburguesa.
 */
async function update(newHamburguesa: IHamburguesa, token: string): Promise<string> {
  const userId = UserService.verifyToken(token);
  if (!userId) {
    return "Token Invalido";
  }

  if (!newHamburguesa._id) {
    return "Falta el id de la hamburguesa";
  }

  // get the hamburguesa
  const hamburguesa = await getOne(newHamburguesa._id);
  if (!hamburguesa) {
    return "hamburguesa no encontrado";
  }

  // check if the user is the creator
  if (hamburguesa.creatorId.toString() !== userId) {
    // check if the user is admin
    const isAdmin = await UserRepo.checkIfAdmin(
      new mongoose.Types.ObjectId(userId)
    );
    if (!isAdmin) {
      return "No tenes permisos para modificar este hamburguesa";
    }
  }

  // check if the name or the ingredients are the same
  const isUnique = await checkNameAndIngredientesUnique(newHamburguesa);
  if (!isUnique) {
    return "Ya hay un hamburguesa igual";
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
 * Delete one hamburguesa.
 */
async function delete_(
  id: mongoose.Types.ObjectId,
  token: string
): Promise<void> {
  const userId = UserService.verifyToken(token);
  // get the hamburguesa
  const hamburguesa = await getOne(id);
  if (!hamburguesa) {
    return Promise.reject("Hamburguesa not found");
  }

  // check if the user is the creator
  if (hamburguesa.creatorId.toString() !== userId) {
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
