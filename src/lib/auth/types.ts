export type AuthRole = "ADMIN" | "CLIENT";

export type PublicAuthUser = {
  id: number;
  email: string;
  role: AuthRole;
  clientId: number | null;
};
