import { IHamburguesa, Ingrediente } from "@src/models/Hamburguesa";
import { IUser } from "@src/models/User";
import mongoose, { Connection, Schema } from "mongoose";

const userSchema: Schema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    creaciones: Array<IHamburguesa>,
    isAdmin: Boolean,
  },
  { collection: "User" }
);

const HamburguesaSchema: Schema = new mongoose.Schema(
  {
    nombre: { type: String, required: false },
    ingredientes: { type: Array<Ingrediente>, required: false },
    creatorId: { type: mongoose.Types.ObjectId, required: false },
  },
  { collection: "Hamburguesa" }
);

const db: Connection = mongoose.createConnection(
  "mongodb://127.0.0.1:27017/Salardich"
);

export const HamburguesaModel = db.model<IHamburguesa>("Hamburguesa", HamburguesaSchema);
export const UserModel = db.model<IUser>("User", userSchema);
