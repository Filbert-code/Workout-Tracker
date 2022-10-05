import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { userPoolClient } from "./clients/UserPoolClient";

export const refreshTokens = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    const response = await userPoolClient.send(
      new InitiateAuthCommand({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: "1vdmuccspf3jne0ig707rd9foo",
        AuthParameters: {
          REFRESH_TOKEN: refreshToken!!,
        },
      })
    );

    localStorage.setItem("idToken", response.AuthenticationResult?.IdToken!!);
    localStorage.setItem(
      "accessToken",
      response.AuthenticationResult?.AccessToken!!
    );
    localStorage.setItem(
      "tokenExpireEpoch",
      (
        Date.now() +
        response.AuthenticationResult?.ExpiresIn!! * 1000
      ).toString()
    );
    return (
      Date.now() +
      response.AuthenticationResult?.ExpiresIn!! * 1000
    ).toString();
  } catch (error) {
    console.log(error);
    console.log("Could not refresh credentials.");
    localStorage.clear();
    return "false";
  }
};
