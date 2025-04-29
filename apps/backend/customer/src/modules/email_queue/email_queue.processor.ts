import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import type { Job } from "bullmq";

import {
  EMAIL_PROCESS_NAMES,
  QUEUE_PROCESSOR_NAMES,
} from "@/common/constants/queue.constants";
import {
  RegisterVerificationEmailToCustomer,
  ResetPasswordEmailToCustomer,
} from "@/common/interfaces/email.interface";
import { EmailService } from "@/modules/email/email.service";

@Injectable()
@Processor(QUEUE_PROCESSOR_NAMES.EMAIL_PROCESSOR)
export class EmailQueueProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { name } = job;

    console.log("email process is working?");
    switch (name) {
      case EMAIL_PROCESS_NAMES.RESET_PASSWORD_EMAIL_TO_CUSTOMER_PROCESS:
        return await this.resetPasswordEmailToCustomer(job);
      case EMAIL_PROCESS_NAMES.REGISTER_VERIFICATION_EMAIL_TO_CUSTOMER_PROCESS:
        return await this.registerVerificationEmailToCustomer(job);
    }
  }

  private async resetPasswordEmailToCustomer(
    job: Job<ResetPasswordEmailToCustomer>,
  ) {
    const { locale, email, reset_url } = job.data;

    try {
      await this.emailService.resetPasswordEmailToCustomer({
        locale,
        email,
        reset_url,
      });
    } catch (error) {
      console.error(
        "Error processing queue to send verification email to customer:",
        error,
      );
    }
  }

  private async registerVerificationEmailToCustomer(
    job: Job<RegisterVerificationEmailToCustomer>,
  ) {
    const { email, context } = job.data;

    try {
      await this.emailService.registerVerificationEmailToCustomer({
        email,
        context,
      });
    } catch (error) {
      console.error(
        "Error processing queue to send verification email to customer:",
        error,
      );
    }
  }
}
