/**
 * Express router paths go here.
 */


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
    Base: "/hamburguesas",
    Get: "/",
    Add: "/",
    Update: "/",
    Delete: "/:id",
    GetAllByCreatorId: "/creator/:creatorId",
  },
} as const;
