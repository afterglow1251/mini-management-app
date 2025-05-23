import type { User } from "../../types/user/user.types";

export function mapUsersToOptions(users: User[]) {
  return users.map((user) => ({
    label: user.name,
    value: user.id,
  }));
}
