import { Injectable } from '@nestjs/common';
import type { AccessControlOverviewContract } from '@swisskit/contracts/access-control';
import { ACCESS_CONTROL_CORE_PERMISSIONS } from '@swisskit/contracts/access-control-catalog';

@Injectable()
export class AccessControlService {
  getOverview(): AccessControlOverviewContract {
    return {
      module: 'access-control',
      status: 'available',
      permissions: [...ACCESS_CONTROL_CORE_PERMISSIONS],
      roles: [],
    };
  }
}
