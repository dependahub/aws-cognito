import {
	CognitoIdentityProviderClient,
	AdminAddUserToGroupCommand,
	AdminCreateUserCommand,
	AdminUpdateUserAttributesCommand,
	AdminSetUserPasswordCommand,
	AdminResetUserPasswordCommand,
	AdminConfirmSignUpCommand,
	AdminDisableUserCommand,
	AdminEnableUserCommand,
	AdminGetUserCommand,
	AdminListGroupsForUserCommand,
	AdminRemoveUserFromGroupCommand,
	AdminUserGlobalSignOutCommand,
	AdminDeleteUserCommand,
	ListGroupsCommand,
	ListUsersCommand,
	ListUsersInGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {fromIni} from '@aws-sdk/credential-providers';

class CognitoClass {
	/** @type {CognitoIdentityProviderClient} */
	#client = new CognitoIdentityProviderClient();
	config = {
		userPoolId: '',
		region: undefined,
		profile: undefined,
	};

	/**
	 * 初期設定のオーバーライド
	 * @param {object} config
	 * @param {string} config.userPoolId - 後から変更可
	 * @param {string?} [config.profile] - AWS CLIのプロファイル名
	 * @param {string?} [config.region] - AWSリージョン
	 */
	configure(config) {
		Object.assign(this.config, config);

		const {region, profile} = this.config;
		const cognitoConfig = {
			region,
		};
		if (profile) {
			cognitoConfig.credentials = fromIni({profile});
		}

		this.#client = new CognitoIdentityProviderClient(cognitoConfig);
	}

	/**
	 * 新しいインスタンスを作成します。
	 * @param {object} config
	 * @param {string} config.userPoolId - 後から変更可
	 * @param {string?} [config.profile] - AWS CLIのプロファイル名
	 * @param {string?} [config.region] - AWSリージョン
	 */
	createInstance(config) {
		const newInstance = new CognitoClass();
		newInstance.configure(config);
		return newInstance;
	}

	/**
	 * @param {string} username ユーザ名（メールアドレス）
	 * @param {string} temporaryPassword 仮パスワード
	 * @param {import('@aws-sdk/client-cognito-identity-provider').AttributeType[]} userAttributes
	 * @param {boolean} isSendMessage
	 * @returns {Promise<import('@aws-sdk/client-cognito-identity-provider').AdminCreateUserCommandOutput>}
	 * @example
	 * const response = await Cognito.create({'username', 'temporaryPassword', [
	 * 	{
	 * 		Name: 'email',
	 * 		Value: 'mail@example.com',
	 * 	},
	 * 	{
	 * 		Name: 'phone_number',
	 * 		Value: '+819012345678',
	 * 	},
	 * ]});
	 */
	async adminCreateUser(username, temporaryPassword, userAttributes = [], isSendMessage = false) {
		/** @type {import('@aws-sdk/client-cognito-identity-provider').AdminCreateUserCommandInput} */
		const parameters = {
			UserPoolId: this.config.userPoolId,
			Username: username,
			TemporaryPassword: temporaryPassword,
			UserAttributes: userAttributes,
			ForceAliasCreation: false,
			MessageAction: isSendMessage ? undefined : 'SUPPRESS',
		};

		try {
			const response = await this.#client.send(new AdminCreateUserCommand(parameters));
			return response;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	/**
	 * @param {string} username
	 * @param {import('@aws-sdk/client-cognito-identity-provider').AttributeType[]} userAttributes
	 * @returns {Promise<import('@aws-sdk/client-cognito-identity-provider').AdminUpdateUserAttributesCommandOutput>}
	 * @example
	 * const response = await Cognito.updateUserAttributes('username', [
	 * 	{
	 * 		Name: 'email',
	 * 		Value: 'mail@example.com',
	 * 	},
	 * 	{
	 * 		Name: 'phone_number',
	 * 		Value: '+819012345678',
	 * 	},
	 * ]);
	 */
	async adminUpdateUserAttributes(username, userAttributes) {
		/** @type {import('@aws-sdk/client-cognito-identity-provider').AdminUpdateUserAttributesCommandInput} */
		const parameters = {
			UserPoolId: this.config.userPoolId,
			Username: username,
			UserAttributes: userAttributes,
		};

		try {
			const response = await this.#client.send(new AdminUpdateUserAttributesCommand(parameters));
			return response;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	/**
	 * @param {string} username
	 * @param {string} password
	 * @param {boolean} isParmanent - (default) false: 仮パスワード / true: 永続パスワード
	 */
	async adminSetUserPassword(username, password, isParmanent = false) {
		/** @type {import('@aws-sdk/client-cognito-identity-provider').AdminSetUserPasswordCommandInput} */
		const parameters = {
			UserPoolId: this.config.userPoolId,
			Username: username,
			Password: password,
			Permanent: isParmanent,
		};

		try {
			const response = await this.#client.send(new AdminSetUserPasswordCommand(parameters));
			return response;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async adminResetUserPassword(username) {
		/** @type {import('@aws-sdk/client-cognito-identity-provider').AdminResetUserPasswordCommandInput} */
		const parameters = {
			UserPoolId: this.config.userPoolId,
			Username: username,
		};

		try {
			const response = await this.#client.send(new AdminResetUserPasswordCommand(parameters));
			return response;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async adminAddUserToGroup(username, groupname) {
		const parameters = {
			GroupName: groupname,
			UserPoolId: this.config.userPoolId,
			Username: username,
		};

		try {
			await this.#client.send(new AdminAddUserToGroupCommand(parameters));
			return {
				message: `Success adding ${username} to ${groupname}`,
			};
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async adminRemoveUserFromGroup(username, groupname) {
		const parameters = {
			GroupName: groupname,
			UserPoolId: this.config.userPoolId,
			Username: username,
		};

		try {
			await this.#client.send(new AdminRemoveUserFromGroupCommand(parameters));
			return {
				message: `Removed ${username} from ${groupname}`,
			};
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	// Confirms as an admin without using a confirmation code.
	async confirmUserSignUp(username) {
		const parameters = {
			UserPoolId: this.config.userPoolId,
			Username: username,
		};

		try {
			await this.#client.send(new AdminConfirmSignUpCommand(parameters));
			return {
				message: `Confirmed ${username} registration`,
			};
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async adminDisableUser(username) {
		const parameters = {
			UserPoolId: this.config.userPoolId,
			Username: username,
		};

		try {
			await this.#client.send(new AdminDisableUserCommand(parameters));
			return {
				message: `Disabled ${username}`,
			};
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async adminEnableUser(username) {
		const parameters = {
			UserPoolId: this.config.userPoolId,
			Username: username,
		};

		try {
			await this.#client.send(new AdminEnableUserCommand(parameters));
			return {
				message: `Enabled ${username}`,
			};
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async adminGetUser(username) {
		try {
			const result = await this.#client.send(new AdminGetUserCommand({
				UserPoolId: this.config.userPoolId,
				Username: username,
			}));
			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async adminDeleteUser(username) {
		const parameters = {
			UserPoolId: this.config.userPoolId,
			Username: username,
		};

		try {
			await this.#client.send(new AdminDeleteUserCommand(parameters));
			return {
				message: `Deleted ${username}`,
			};
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async adminListGroupsForUser(username, Limit, NextToken) {
		const parameters = {
			UserPoolId: this.config.userPoolId,
			Username: username,
			...(Limit && {Limit}),
			...(NextToken && {NextToken}),
		};

		try {
			const result = await this.#client.send(new AdminListGroupsForUserCommand(parameters));
			/**
			 * We are filtering out the results that seem to be innapropriate for client applications
			 * to prevent any informaiton disclosure. Customers can modify if they have the need.
			 */
			for (const value of result.Groups) {
				delete value.UserPoolId;
				delete value.LastModifiedDate;
				delete value.CreationDate;
				delete value.Precedence;
				delete value.RoleArn;
			}

			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	// Signs out from all devices, as an administrator.
	async adminUserGlobalSignOut(username) {
		const parameters = {
			UserPoolId: this.config.userPoolId,
			Username: username,
		};

		try {
			await this.#client.send(new AdminUserGlobalSignOutCommand(parameters));
			return {
				message: `Signed out ${username} from all devices`,
			};
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	/**
	 * @param {Pick<import('@aws-sdk/client-cognito-identity-provider').ListUsersCommandInput, 'Filter' | 'Limit' | 'PaginationToken'>} input
	 * @returns {Promise<import('@aws-sdk/client-cognito-identity-provider').ListUsersCommandOutput>}
	 */
	async listUsers({Filter, Limit, PaginationToken}) {
		const parameters = {
			UserPoolId: this.config.userPoolId,
			Limit,
			PaginationToken,
			Filter,
		};

		try {
			const result = await this.#client.send(new ListUsersCommand(parameters));

			// Rename to NextToken for consistency with other Cognito APIs
			result.NextToken = result.PaginationToken;
			delete result.PaginationToken;

			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async listGroups(Limit, PaginationToken) {
		const parameters = {
			UserPoolId: this.config.userPoolId,
			...(Limit && {Limit}),
			...(PaginationToken && {PaginationToken}),
		};

		try {
			const result = await this.#client.send(new ListGroupsCommand(parameters));

			// Rename to NextToken for consistency with other Cognito APIs
			result.NextToken = result.PaginationToken;
			delete result.PaginationToken;

			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	async listUsersInGroup(groupname, Limit, NextToken) {
		const parameters = {
			GroupName: groupname,
			UserPoolId: this.config.userPoolId,
			...(Limit && {Limit}),
			...(NextToken && {NextToken}),
		};

		try {
			const result = await this.#client.send(new ListUsersInGroupCommand(parameters));
			return result;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}

/**
 * Cognito操作
 */
export const cognito = new CognitoClass();
export default cognito;
