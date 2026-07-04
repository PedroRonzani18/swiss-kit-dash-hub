import { Module } from '@nestjs/common';
import { AccessListController } from './controllers/access-list.controller';
import { AccessListRepository } from './repositories/access-list.repository';
import { AccessListService } from './services/access-list.service';

@Module({
  controllers: [AccessListController],
  providers: [AccessListRepository, AccessListService],
})
export class AccessRegistryModule {}
