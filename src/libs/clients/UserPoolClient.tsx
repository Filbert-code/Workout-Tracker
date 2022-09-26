import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

const REGION = "us-west-2";
const userPoolClient = new CognitoIdentityProviderClient({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: "us-west-2:5ef750b5-7a12-47c4-bee7-02c24da20cb7",
  }),
});
export { userPoolClient };
