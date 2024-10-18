import type { CreateAuthChallengeTriggerHandler } from "aws-lambda";
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import outputs  from "../../../amplify_outputs.json";

export const handler: CreateAuthChallengeTriggerHandler = async (event) => {
    if (event.request.challengeName === "CUSTOM_CHALLENGE") {
        const challengeCode = event.request.userAttributes["custom:face_id"];

        event.response.challengeMetadata = "TOKEN_CHECK";

        event.response.publicChallengeParameters = {
            trigger: "true",
            code: challengeCode,
        };
        event.response.privateChallengeParameters = { trigger: "true" };
        event.response.privateChallengeParameters.answer = challengeCode;
    }
    return event;
};
