import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "@nestjs-modules/mailer";
import path from "path";

import {
  RegisterVerificationEmailToCustomer,
  ResetPasswordEmailToCustomer,
} from "@/common/interfaces/email.interface";

interface EmailProps {
  to: string;
  title: string;
  template: string;
  context: object | null | any;
  bcc?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  // Sent reset url email to customer
  async resetPasswordEmailToCustomer({
    locale,
    email,
    reset_url,
  }: ResetPasswordEmailToCustomer) {
    await this.sendEmail({
      to: email,
      title: "[Furever Home] Password Reset",
      template: "reset_email",
      context: {
        year: new Date().getFullYear(),
        url: reset_url,
      },
    });
  }

  // verify account
  async registerVerificationEmailToCustomer({
    email,
    context,
  }: RegisterVerificationEmailToCustomer) {
    const frontendUrl = this.configService.get<string>(
      "email.customerFrontendUrl",
    );
    await this.sendEmail({
      to: email,
      title: "[Furever Home] Verify Account",
      template: "register_verify",
      context: {
        year: new Date().getFullYear(),
        url: `${frontendUrl}/verify?token=${context.token}`,
      },
    });
  }

  private async sendEmail({ to, title, template, context, bcc }: EmailProps) {
    const params = {
      to,
      bcc,
      subject: title,
      template: path.join(__dirname, `/templates/${template}`), // `.hbs` extension is appended automatically
      context,
    };

    try {
      await this.mailerService.sendMail(params);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${title}`, error);
      throw new Error("EMAIL_SENDING_FAILED");
    }
  }
}
