[![Node.js Version](https://img.shields.io/badge/node-22.x-brightgreen.svg)](https://nodejs.org/)
[![XO code style](https://shields.io/badge/code_style-5ed9c7?logo=xo&labelColor=gray&logoSize=auto)](https://github.com/xojs/xo)

# AWS Cognito

Cognito操作セット

## Examples

```javascript
import process from 'node:process';
import {cognito} from '@dependahub/aws-cognito';

const {REGION, USERPOOLID} = process.env;

cognito.configure({
	userPoolId: USERPOOLID, 
	region: REGION
});

const cognitoUser = await (async () => {
	const {Users} = await cognito.listUsers({
		Filter: `sub = "${cognitoSub}"`,
		Limit: 1,
	});
	return Users[0];
})();
```

## Test Examples

```javascript
import test from 'ava';
import {cognito} from '@dependahub/aws-cognito';

cognito.configure({
	profile: 'your-aws-profile-dev'
	userPoolId: 'xxxxxxxxxxx', 
	region: 'ap-northeast-1',
});

test('listUsers', async t => {
	const cognitoSub = 'xxxxxxxxxxxxxx';
	const cognitoUser = await (async () => {
	const {Users} = await cognito.listUsers({
			Filter: `sub = "${cognitoSub}"`,
			Limit: 1,
		});
		return Users[0];
	})();
	t.is(cognitoUser.Username == 'TestUser')
});
```

## Required Permissions

```json
{
  "Effect": "Allow",
  "Action": [
    "cognito-idp:ListUsersInGroup",
    "cognito-idp:AdminUserGlobalSignOut",
    "cognito-idp:AdminEnableUser",
    "cognito-idp:AdminDisableUser",
    "cognito-idp:AdminRemoveUserFromGroup",
    "cognito-idp:AdminAddUserToGroup",
    "cognito-idp:AdminListGroupsForUser",
    "cognito-idp:AdminGetUser",
    "cognito-idp:AdminConfirmSignUp",
    "cognito-idp:ListUsers",
    "cognito-idp:ListGroups"
  ],
  "Resource": {
    "Fn::Join": [
      "",
      [
        "arn:aws:cognito-idp:",
        {
          "Ref": "AWS::Region"
        },
        ":",
        {
          "Ref": "AWS::AccountId"
        },
        ":userpool/",
        {
          "Ref": "authAuthUserPoolId"
        }
      ]
    ]
  }
}
```
