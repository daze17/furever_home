export interface ResetPasswordEmailToCustomer {
  locale: string;
  email: string;
  reset_url: string;
  bcc?: string;
}
