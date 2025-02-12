/**
 * Express router paths go here.
 */

import Hamburguesas from "@src/models/Hamburguesas";

export default {
  Base: "/api",
  Users: {
    Base: "/users",
    Get: "/",
    Add: "/",
    Login: "/login",
    Update: "/",
    Delete: "/:id",
  },
  Hamburguesas: {
    Base: "/hamburguesa",
    Get: "/",
    Add: "/",
    Update: "/",
    Delete: "/:id",
    GetAllByCreatorId: "/creator/:creatorId",
  },
} as const;
