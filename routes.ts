import { Role } from "./prisma/generated/enums";

export const publicRoutes = [];

export const userRoutes = ["/user/", "/user/dasboard"];

export const authRoutes = [
  "/login",
  // "/logout",
  // "/auth/register",
  // "/auth/error",
  // "/auth/reset-password",
  // "/auth/new-password",
];
export const adminRoutes = [
  "/admin",
  "/admin/dasboard",
  "/admin/users",
  "/admin/games",
  "/admin/categories",
  "/admin/votes",
];
export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT: Record<Role, string> = {
  [Role.ADMIN]: "/admin/users",
  [Role.USER]: "/user/dashboard",
};
