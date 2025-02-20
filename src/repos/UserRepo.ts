import { IUser } from "@src/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { UserModel } from "./Mongoose";

// **** Functions **** //

/**
 * Get one user.
 */
async function getOne(id: mongoose.Types.ObjectId): Promise<IUser | null> {
  return new Promise<IUser | null>((resolve, reject) => {
    UserModel.findOne({ _id: id })
      .then((user: any) => {
        resolve(user);
      })
      .catch((err: any) => {
        if (err) {
          reject(err);
          return;
        }
      });
  });
}

/**
 * See if a user with the given id exists.
 */
async function persists(id: mongoose.Types.ObjectId): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    UserModel.findOne({ _id: id })
      .then((user: any) => {
        if (user) {
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

/**
 * Get all users.
 */
async function getAll(): Promise<IUser[]> {
  return new Promise<IUser[]>((resolve, reject) => {
    UserModel.find({})
      .then((users: any) => {
        resolve(users);
      })
      .catch((err: any) => {
        if (err) {
          reject(err);
          return;
        }
      });
  });
}

/**
 * Add one user.
 */
async function add(user: IUser): Promise<void> {
  const saltRounds = 10; // Puedes ajustar el número de rondas según sea necesario
  return new Promise<void>((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) reject(err);

      // Hashear la contraseña con el salt generado
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) reject(err);

        // join salt and hash to store in db
        user.password = hash;
        UserModel.create(user)
          .then(() => resolve())
          .catch((err: any) => {
            if (err) {
              reject(err);
              return;
            }
          });
      });
    });
  });
}

async function login(user: IUser): Promise<{ id: string; isAdmin: boolean }> {
  // eslint-disable-next-line max-len
  return UserModel.findOne({ email: user.email }).then(
    (foundUser: IUser | null) => {
      if (foundUser) {
        return bcrypt.compare(user.password, foundUser.password).then((ok) => {
          if (!ok) {
            return { id: "", isAdmin: false };
          }
          return { id: foundUser._id.toString(), isAdmin: foundUser.isAdmin };
        });
      } else {
        return { id: "", isAdmin: false };
      }
    }
  );
}

/**
 * Update a user.
 */
async function update(user: IUser): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    UserModel.updateOne({ _id: user._id }, user)
      .then(() => resolve())
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
  });
}

/**
 * Delete one user.
 */
async function delete_(id: mongoose.Types.ObjectId): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    UserModel.deleteOne({ _id: id })
      .then(() => resolve())
      .catch((err: any) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
  });
}

async function checkIfAdmin(id: mongoose.Types.ObjectId): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    UserModel.findOne({ _id: id })
      .then((user: any) => {
        if (user) {
          resolve(user.isAdmin);
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

// **** Export default **** //

export default {
  getOne,
  persists,
  getAll,
  add,
  login,
  update,
  delete: delete_,
  checkIfAdmin,
} as const;
