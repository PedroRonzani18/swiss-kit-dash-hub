import { Injectable } from '@nestjs/common';
import {
  ACCESS_CONTROL_CORE_PERMISSIONS,
  type AccessControlOverviewContract,
} from '@swisskit/contracts/access-control';

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
