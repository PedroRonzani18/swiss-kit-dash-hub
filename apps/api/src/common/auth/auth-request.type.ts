import type { Request } from 'express';
import type {
  AuthenticatedUserContract,
  GoogleAuthProfileContract,
} from '@/common/contracts';

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUserContract;
};

export type GoogleAuthRequest = Request & {
  user: GoogleAuthProfileContract;
};
