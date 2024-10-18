import { defineAuth } from '@aws-amplify/backend';
import { createAuthChallenge } from './create-auth-challenge/resource';
import { defineAuthChallenge } from './define-auth-challenge/resource';
import { verifyAuthChallengeResponse } from './verify-auth-challenge/resource';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    "custom:face_id": {
      dataType: "String",
      mutable: true,
    }
  },
  triggers: {
    createAuthChallenge,
    defineAuthChallenge,
    verifyAuthChallengeResponse,
  },
});
