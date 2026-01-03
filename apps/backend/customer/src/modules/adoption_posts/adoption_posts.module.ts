import { Module } from "@nestjs/common";

import { AdoptionPostsController } from "./adoption_posts.controller";
import { AdoptionPostsRepository } from "./adoption_posts.repository";
import { AdoptionPostsService } from "./adoption_posts.service";

@Module({
  imports: [],
  controllers: [AdoptionPostsController],
  providers: [AdoptionPostsService, AdoptionPostsRepository],
  exports: [AdoptionPostsRepository, AdoptionPostsService],
})
export class AdoptionPostsModule {}
