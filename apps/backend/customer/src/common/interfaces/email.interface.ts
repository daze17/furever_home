export interface ResetPasswordEmailToCustomer {
  locale: string;
  email: string;
  reset_url: string;
  bcc?: string;
}

export interface RegisterVerificationEmailToCustomer {
  email: string;
  context: {
    token: string;
  };
  bcc?: string;
}
