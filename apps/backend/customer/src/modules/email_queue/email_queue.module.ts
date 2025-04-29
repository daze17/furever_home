import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { QUEUE_PROCESSOR_NAMES } from '@/common/constants/queue.constants';
import { EmailEventsListener } from '@/common/events/email_queue.event';
import { EmailModule } from '@/modules/email/email.module';

import { EmailQueueProcessor } from './email_queue.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_PROCESSOR_NAMES.EMAIL_PROCESSOR,
    }),
    EmailModule,
  ],
  providers: [EmailQueueProcessor, EmailEventsListener],
  exports: [EmailQueueProcessor, BullModule],
})
export class EmailQueueModule {}
