// Validators.email regexp rejects most invalid emails but has a few edge-cases slip through.
// For example, it allows emails ending with numbers like hello@biggive.org.123
// We needed tighter validation, so have adapted the Angular pattern iteratively including
// some simplification. We needed to loosen part of it in Dec '22 because subdomains
// weren't properly supported in the previous version.
export const EMAIL_REGEXP: RegExp =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9-]{1,180}\.)+[a-zA-Z]{2,}$/;
