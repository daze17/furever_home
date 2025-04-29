import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import fs from 'fs';
import { I18nService } from 'nestjs-i18n';
import path from 'path';

import { ResetPasswordEmailToCustomer } from '@/common/interfaces/email.interface';
// import { I18nTranslations } from '@/generated/i18n.generated';

interface EmailProps {
  to: string;
  title: string;
  template: string;
  context: object | null | any;
  bcc?: string;
  locale: string;
}

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
    // private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  // Sent reset url email to customer
  async resetPasswordEmailToCustomer({
    locale,
    email,
    reset_url,
  }: ResetPasswordEmailToCustomer) {
    await this.sendEmail({
      to: email,
      title: '[Furever Home] Password Reset',
      template: 'reset_email',
      context: {
        year: new Date().getFullYear(),
        url: reset_url,
      },
      locale,
    });
  }

  private async sendEmail({
    to,
    title,
    template,
    context,
    bcc,
    locale,
  }: EmailProps) {
    const templatePath = this.getTemplatePath(locale, template);

    const params = {
      to,
      bcc,
      subject: title,
      template: templatePath, // `.hbs` extension is appended automatically
      context,
    };

    try {
      await this.mailerService.sendMail(params);
    } catch (error) {
      console.error(error);
      // throw new Error("EMAIL_SENDING_FAILED");
    }
  }

  // Check if template exists for requested locale, if not fallback to ja
  private getTemplatePath(locale: string, template: string) {
    let templatePath = path.join(__dirname, `/templates/${locale}/${template}`);

    if (!fs.existsSync(`${templatePath}.hbs`)) {
      templatePath = path.join(__dirname, `/templates/e/${template}`);
    }

    return templatePath;
  }
}
