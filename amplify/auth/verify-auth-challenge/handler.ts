import type { VerifyAuthChallengeResponseTriggerHandler } from "aws-lambda"

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (
    event
) => {
    event.response.answerCorrect = true;
    return event;
};
