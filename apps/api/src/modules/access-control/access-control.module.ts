import { Module } from '@nestjs/common';
import { AccessControlController } from './controllers/access-control.controller';
import { AccessControlService } from './services/access-control.service';

@Module({
  controllers: [AccessControlController],
  providers: [AccessControlService],
})
export class AccessControlModule {}
