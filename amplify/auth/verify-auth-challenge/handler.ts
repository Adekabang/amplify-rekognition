import type { VerifyAuthChallengeResponseTriggerHandler } from "aws-lambda"

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (
    event
) => {
    if (event.request.challengeAnswer === event.request.userAttributes["custom:face_id"]) {
        event.response.answerCorrect = true;
    } else {
        event.response.answerCorrect = false;
    }
    return event;
};

