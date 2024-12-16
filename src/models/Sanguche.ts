import mongoose from "mongoose";

// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM =
  "nameOrObj arg must be a string or an object with the appropriate user keys.";

// **** Types **** //

export enum Ingrediente {
  QUESO = "queso",
  TOMATE = "tomate",
  LECHUGA = "lechuga",
  SALSA = "salsa",
}

export enum Pan {
  INTEGRAL = "integral",
  SESAMO = "sesamo",
  BRIOCHE = "brioche",
  CLASICO = "clasico",
}

export enum Proteina {
  CARNE = "carne",
  POLLO = "pollo",
  VEGANO = "vegano",
  PESCADO = "pescado",
}

export interface IHamburguesa {
  _id?: mongoose.Types.ObjectId;
  nombre: string;
  ingredientes: Array<Ingrediente>;
  pan: Pan;
  proteina: Proteina;
  creatorId: mongoose.Types.ObjectId;
}

// **** Functions **** //

/**
 * Create new Hamburguesa.
 */
function new_(
  nombre?: string,
  ingredientes?: Array<Ingrediente>,
  pan?: Pan,
  proteina?: Proteina,
  _id?: string // id last cause usually set by db
): IHamburguesa {
  return {
    _id: _id ? new mongoose.Types.ObjectId(`${_id}`) : undefined,
    nombre: nombre ?? "",
    ingredientes: ingredientes ?? [],
    pan: pan ?? Pan.CLASICO,
    proteina: proteina ?? Proteina.CARNE,
    creatorId: new mongoose.Types.ObjectId(),
  };
}

/**
 * Get Hamburguesa instance from object.
 */
function from(param: object): IHamburguesa {
  if (!isHamburguesa(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  const p = param as IHamburguesa;
  return new_(
    p.nombre,
    p.ingredientes,
    p.pan,
    p.proteina,
    p._id?.toString()
  );
}

/**
 * See if the param meets criteria to be a Hamburguesa.
 */
function isHamburguesa(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === "object" &&
    ("_id" in arg ? typeof (arg as IHamburguesa)._id === "string" : true) &&
    "nombre" in arg &&
    typeof (arg as IHamburguesa).nombre === "string" &&
    "ingredientes" in arg &&
    Array.isArray((arg as IHamburguesa).ingredientes) &&
    (arg as IHamburguesa).ingredientes.every((ing: Ingrediente) =>
      Object.values(Ingrediente).includes(ing)
    ) &&
    "pan" in arg &&
    Object.values(Pan).includes((arg as IHamburguesa).pan) &&
    "proteina" in arg &&
    Object.values(Proteina).includes((arg as IHamburguesa).proteina) &&
    "creatorId" in arg &&
    (typeof (arg as IHamburguesa).creatorId === "string" ||
      (arg as IHamburguesa).creatorId instanceof mongoose.Types.ObjectId)
  );
}

// **** Export default **** //

export default {
  new: new_,
  from,
  isHamburguesa,
} as const;
