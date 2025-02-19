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
    Get: "/:skip",
    Add: "/",
    Update: "/",
    Delete: "/:id",
    Like: "/like/:id",
    PageAmount: "/pageAmount",
    GetAllByCreatorId: "/creator/:creatorId",
  },
} as const;
