import {AuthChecker} from "type-graphql";
import {ApolloContext} from "@/app/api/graphql/route";

// Auth checker for @Authorized decorator
export const authChecker: AuthChecker<ApolloContext> = async ({context}, roles) => {
  const {user} = context;

  if (!user) return false;

  // Check '@Authorized()'
  if (roles.length === 0) {
    // Only authentication required
    return true;
  }

  // Check if user is admin, then allow any action
  if (user.role === "ADMIN") return true;

  // Check '@Authorized(...)' roles overlap
  return roles.includes(user.role);
}