import type { DefineAuthChallengeTriggerHandler } from "aws-lambda"

export const handler: DefineAuthChallengeTriggerHandler = async (event) => {
  // First attempt: Start with SRP_A (Secure Remote Password protocol, step A)
  if (event.request.session.length === 0) {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "SRP_A";
  } else if (
    event.request.session.length === 1 &&
    event.request.session[0].challengeName === "SRP_A" &&
    event.request.session[0].challengeResult === true
  ) {
    // Second attempt: SRP_A was successful, move to PASSWORD_VERIFIER
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "PASSWORD_VERIFIER";
  } else if (
    event.request.session.length === 2 &&
    event.request.session[1].challengeName === "PASSWORD_VERIFIER" &&
    event.request.session[1].challengeResult === true
  ) {
    // Third attempt: PASSWORD_VERIFIER was successful, move to CUSTOM_CHALLENGE
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
  } else if (
    event.request.session.length === 3 &&
    event.request.session[2].challengeName === "CUSTOM_CHALLENGE" &&
    event.request.session[2].challengeResult === true
  ) {
    // Fourth attempt: CUSTOM_CHALLENGE was successful, authentication complete
    event.response.issueTokens = true;
    event.response.failAuthentication = false;
  } else {
    // If we reach here, it means one of the challenges failed or
    // we've gone through more attempts than expected
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
  }

  return event;
};
