/**
 * Extending the provided interface didn't work because we want to make `sub`
 * an object.
 *
 * @link https://github.com/auth0/jwt-decode#use-with-typescript
 */
export interface IdentityJWT {
  exp?: number;
  iat?: number;
  iss?: string;
  sub: {
    complete: boolean;
    person_id: string;
    psp_id: string;
  };
}
