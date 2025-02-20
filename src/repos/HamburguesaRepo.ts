import { IHamburguesa } from "@src/models/Hamburguesa";
import UserService from "@src/services/UserService";
import mongoose from "mongoose";
import { HamburguesaModel } from "./Mongoose";
import UserRepo from "./UserRepo";
// **** Functions **** //

/**
 */
async function getOne(
  _id: mongoose.Types.ObjectId
): Promise<IHamburguesa | null> {
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
      .then((hamburguesa: any) => {
        resolve(hamburguesa);
      })
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
      });
  });
}

/**
 */
async function get(skip: number): Promise<IHamburguesa[]> {
  return new Promise<IHamburguesa[]>((resolve, reject) => {
    HamburguesaModel.find({})
      .sort(
        // sort by number of likes
        { likedBy: -1 }
      )
      .limit(6)
      .skip(skip)
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
 */
async function add(input: IHamburguesa, token: string): Promise<string> {
  const hamburguesa = {
    nombre: input.nombre,
    ingredientes: input.ingredientes,
    likedBy: [],
    creatorId: new mongoose.Types.ObjectId(),
    description: input.description,
  };

  const userId = UserService.verifyToken(token);
  if (!userId) {
    return "Invalid token";
  }
  return checkNameAndIngredientesUnique(hamburguesa)
    .then((res) => {
      if (!res) {
        return "hamburguesa ya existe";
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
 */
async function update(
  newHamburguesa: IHamburguesa,
  token: string
): Promise<string> {
  const userId = UserService.verifyToken(token);
  if (!userId) {
    return "Token Invalido";
  }

  if (!newHamburguesa._id) {
    return "Falta el id de la hamburguesa";
  }

  // get the burger
  const hamburguesa = await getOne(newHamburguesa._id);
  if (!hamburguesa) {
    return "Hamburguesa no encontrada";
  }

  // check if the user is the creator
  if (hamburguesa.creatorId.toString() !== userId) {
    // check if the user is admin
    const isAdmin = await UserRepo.checkIfAdmin(
      new mongoose.Types.ObjectId(userId)
    );
    if (!isAdmin) {
      return "No tenes permisos para modificar esta hamburguesa";
    }
  }

  // check if the name or the ingredients are the same
  const isUnique = await checkNameAndIngredientesUnique(newHamburguesa);
  if (!isUnique) {
    return "Ya hay una hamburguesa igual";
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
 */
async function delete_(
  id: mongoose.Types.ObjectId,
  token: string
): Promise<void> {
  const userId = UserService.verifyToken(token);
  // get the sanguche
  const sanguche = await getOne(id);
  if (!sanguche) {
    return Promise.reject("Sanguche not found");
  }

  // check if the user is the creator
  if (sanguche.creatorId.toString() !== userId) {
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

async function like(id: mongoose.Types.ObjectId, token: string): Promise<void> {
  const idstring = UserService.verifyToken(token);
  if (!idstring) {
    return Promise.reject("Invalid token");
  }
  const userId = new mongoose.Types.ObjectId(idstring);

  const hamburguesa = await getOne(id);
  if (!hamburguesa) {
    return Promise.reject("hamburguesa no encontrada");
  }

  // check if the user has already liked the sanguche
  if (hamburguesa.likedBy.includes(userId)) {
    // remove the like
    return HamburguesaModel.updateOne(
      { _id: id },
      { $pull: { likedBy: userId } }
    ).then(() => {
      return;
    });
  }

  return HamburguesaModel.updateOne(
    { _id: id },
    { $addToSet: { likedBy: userId } }
  ).then(() => {
    return;
  });
}

async function pageAmount() {
  // get the amount of pages (skip 6) as int
  return new Promise<number>((resolve, reject) => {
    HamburguesaModel.countDocuments()
      .then((amount: number) => {
        resolve(Math.ceil(amount / 6));
      })
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
      });
  });
}

// **** Export default **** //

export default {
  getOne,
  persists,
  get: get,
  add,
  like,
  update,
  pageAmount,
  delete: delete_,
  getAllByCreatorId,
} as const;
