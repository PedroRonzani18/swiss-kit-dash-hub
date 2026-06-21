import type {
  AuthProvider,
  EntityId,
  IsoDateString,
} from '@swisskit/contracts/core';

export type { EntityId, IsoDateString };

export type BaseDomainContract = {
  id: EntityId;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
};

export type UserContract = BaseDomainContract & {
  email: string;
  name: string | null;
  avatarUrl: string | null;
  provider: AuthProvider;
  providerUserId: string;
  lastLoginAt: IsoDateString | null;
};

export type AuthenticatedUserContract = {
  id: EntityId;
  email: string;
  name: string | null;
  provider: AuthProvider;
};

export type GoogleAuthProfileContract = {
  email: string;
  name: string | null;
  avatarUrl: string | null;
  providerUserId: string;
};

export type JwtPayloadContract = {
  sub: EntityId;
  email: string;
  name: string | null;
  provider: AuthProvider;
};

export type AuthLoginResultContract = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: AuthenticatedUserContract;
};
