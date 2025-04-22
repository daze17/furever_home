import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';

import { QUEUE_PROCESSOR_NAMES } from '../constants/queue.constants';

@QueueEventsListener(QUEUE_PROCESSOR_NAMES.EMAIL_PROCESSOR)
export class EmailEventsListener extends QueueEventsHost {
  // @OnQueueEvent("active")
  // onActive(job: { jobId: string; prev?: string }) {
  //   console.log(`[EMAIL]: Active job ${job.jobId}...`);
  // }
  // @OnQueueEvent("added")
  // onAdded(job: { jobId: string; name: string }) {
  //   console.log(`[EMAIL]: Job ${job.jobId} added with name ${job.name}`);
  // }
  // @OnQueueEvent("cleaned")
  // onCleaned(job: { count: string }) {
  //   console.log(`[EMAIL]: Cleaned ${job.count} jobs`);
  // }
  // @OnQueueEvent("completed")
  // onCompleted(job: { jobId: string; returnvalue: string; prev?: string }) {
  //   console.log(
  //     `[EMAIL]: Job ${job.jobId} completed with result: ${job.returnvalue}`,
  //   );
  // }
  // @OnQueueEvent("debounced")
  // onDebounced(job: { jobId: string; debounceId: string }) {
  //   console.log(
  //     `[EMAIL]: Job ${job.jobId} debounced with ID: ${job.debounceId}`,
  //   );
  // }
  // @OnQueueEvent("deduplicated")
  // onDeduplicated(job: { jobId: string; deduplicationId: string }) {
  //   console.log(
  //     `[EMAIL]: Job ${job.jobId} deduplicated with ID: ${job.deduplicationId}`,
  //   );
  // }
  // @OnQueueEvent("delayed")
  // onDelayed(job: { jobId: string; delay: number }) {
  //   console.log(`[EMAIL]: Job ${job.jobId} delayed by ${job.delay}ms`);
  // }
  // @OnQueueEvent("drained")
  // onDrained() {
  //   console.log("[EMAIL]: Queue drained");
  // }
  // @OnQueueEvent("duplicated")
  // onDuplicated(job: { jobId: string }) {
  //   console.log(`[EMAIL]: Job ${job.jobId} was duplicated`);
  // }
  // @OnQueueEvent("error")
  // onError(error: Error) {
  //   console.log(`[EMAIL]: Error occurred: ${error.message}`);
  // }
  // @OnQueueEvent("failed")
  // onFailed(job: { jobId: string; failedReason: string; prev?: string }) {
  //   console.log(`[EMAIL]: Job ${job.jobId} failed: ${job.failedReason}`);
  // }
  // @OnQueueEvent("paused")
  // onPaused() {
  //   console.log("[EMAIL]: Queue paused");
  // }
  // @OnQueueEvent("progress")
  // onProgress(job: { jobId: string; data: number | object }) {
  //   console.log(
  //     `[EMAIL]: Job ${job.jobId} progress: ${JSON.stringify(job.data)}`,
  //   );
  // }
  // @OnQueueEvent("removed")
  // onRemoved(job: { jobId: string; prev: string }) {
  //   console.log(`[EMAIL]: Job ${job.jobId} removed`);
  // }
  // @OnQueueEvent("resumed")
  // onResumed() {
  //   console.log("[EMAIL]: Queue resumed");
  // }
  // @OnQueueEvent("retries-exhausted")
  // onRetriesExhausted(job: { jobId: string; attemptsMade: string }) {
  //   console.log(
  //     `[EMAIL]: Job ${job.jobId} retries exhausted after ${job.attemptsMade} attempts`,
  //   );
  // }
  // @OnQueueEvent("stalled")
  // onStalled(job: { jobId: string }) {
  //   console.log(`[EMAIL]: Job ${job.jobId} stalled`);
  // }
  // @OnQueueEvent("waiting")
  // onWaiting(job: { jobId: string; prev?: string }) {
  //   console.log(`[EMAIL]: Job ${job.jobId} waiting`);
  // }
  // @OnQueueEvent("waiting-children")
  // onWaitingChildren(job: { jobId: string }) {
  //   console.log(`[EMAIL]: Job ${job.jobId} waiting for children`);
  // }
}
