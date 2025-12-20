import { jwtDecode } from "jwt-decode";

export const checkIfTokenIsValid = (token: string) => {
  const decoded = jwtDecode(token);

  // if exp is not in the token, it is invalid
  if (!decoded.exp) {
    return false;
  }

  // if the token is expired, it is invalid
  if (decoded.exp < Date.now() / 1000) {
    return false;
  }

  return true;
};
