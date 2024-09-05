import { Donation } from './donation.model';

export class DonationCreatedResponse {
  constructor(
    public donation: Donation,
    public jwt: string, // Signed token (JWS) providing authorisation to work with the donation in `donation`.

    /**
     * @see https://docs.stripe.com/api/customer_sessions/object#customer_session_object-client_secret
     */
  public stripeSessionSecret?: string,
  ) {}
}
