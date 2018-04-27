import {AuthConfig, AuthConfigAdditional} from '@juztcode/angular-auth';
import {LOGIN_URL, REFRESH_URL} from './api.config';

export const AUTH_CONFIG: AuthConfig = {
  persistTokensEnabled: true,
  refreshTokenEnabled: true,
  userPermissionsEnabled: true,
  loginUrl: LOGIN_URL,
  refreshTokenUrl: REFRESH_URL,
  permissionDataSet: [
    {userRoleId: 1, permissions: {canEdit: true}},
    {userRoleId: 2, permissions: {canEdit: false}}
  ],
  accessTokenExpiredResponseStatus: 403,
  accessTokenExpiredErrorCode: 4001,
  refreshTokenExpiredResponseStatus: 403,
  refreshTokenExpiredErrorCode: 4002
};

export const AUTH_CONFIG_ADDITIONAL: AuthConfigAdditional = {
  userRoleIdKey: 'role',
  globalHttpHeaders: [{key: 'Content-Type', value: 'application/json', excludedMethods: ['GET']}]
};