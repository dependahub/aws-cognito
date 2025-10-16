/**
 * Cognito操作
 */
export const cognito: CognitoClass;
export default cognito;
declare class CognitoClass {
    config: {
        userPoolId: string;
        region: any;
        profile: any;
    };
    /**
     * 初期設定のオーバーライド
     * @param {object} config
     * @param {string} config.userPoolId - 後から変更可
     * @param {string?} [config.profile] - AWS CLIのプロファイル名
     * @param {string?} [config.region] - AWSリージョン
     */
    configure(config: {
        userPoolId: string;
        profile?: string | null;
        region?: string | null;
    }): void;
    /**
     * 新しいインスタンスを作成します。
     * @param {object} config
     * @param {string} config.userPoolId - 後から変更可
     * @param {string?} [config.profile] - AWS CLIのプロファイル名
     * @param {string?} [config.region] - AWSリージョン
     */
    createInstance(config: {
        userPoolId: string;
        profile?: string | null;
        region?: string | null;
    }): CognitoClass;
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
    adminCreateUser(username: string, temporaryPassword: string, userAttributes?: import("@aws-sdk/client-cognito-identity-provider").AttributeType[], isSendMessage?: boolean): Promise<import("@aws-sdk/client-cognito-identity-provider").AdminCreateUserCommandOutput>;
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
    adminUpdateUserAttributes(username: string, userAttributes: import("@aws-sdk/client-cognito-identity-provider").AttributeType[]): Promise<import("@aws-sdk/client-cognito-identity-provider").AdminUpdateUserAttributesCommandOutput>;
    /**
     * @param {string} username
     * @param {string} password
     * @param {boolean} isParmanent - (default) false: 仮パスワード / true: 永続パスワード
     */
    adminSetUserPassword(username: string, password: string, isParmanent?: boolean): Promise<import("@aws-sdk/client-cognito-identity-provider").AdminSetUserPasswordCommandOutput>;
    adminResetUserPassword(username: any): Promise<import("@aws-sdk/client-cognito-identity-provider").AdminResetUserPasswordCommandOutput>;
    adminAddUserToGroup(username: any, groupname: any): Promise<{
        message: string;
    }>;
    adminRemoveUserFromGroup(username: any, groupname: any): Promise<{
        message: string;
    }>;
    confirmUserSignUp(username: any): Promise<{
        message: string;
    }>;
    adminDisableUser(username: any): Promise<{
        message: string;
    }>;
    adminEnableUser(username: any): Promise<{
        message: string;
    }>;
    adminGetUser(username: any): Promise<import("@aws-sdk/client-cognito-identity-provider").AdminGetUserCommandOutput>;
    adminDeleteUser(username: any): Promise<{
        message: string;
    }>;
    adminListGroupsForUser(username: any, Limit: any, NextToken: any): Promise<import("@aws-sdk/client-cognito-identity-provider").AdminListGroupsForUserCommandOutput>;
    adminUserGlobalSignOut(username: any): Promise<{
        message: string;
    }>;
    /**
     * @param {Pick<import('@aws-sdk/client-cognito-identity-provider').ListUsersCommandInput, 'Filter' | 'Limit' | 'PaginationToken'>} input
     * @returns {Promise<import('@aws-sdk/client-cognito-identity-provider').ListUsersCommandOutput>}
     */
    listUsers({ Filter, Limit, PaginationToken }: Pick<import("@aws-sdk/client-cognito-identity-provider").ListUsersCommandInput, "Filter" | "Limit" | "PaginationToken">): Promise<import("@aws-sdk/client-cognito-identity-provider").ListUsersCommandOutput>;
    listGroups(Limit: any, PaginationToken: any): Promise<import("@aws-sdk/client-cognito-identity-provider").ListGroupsCommandOutput>;
    listUsersInGroup(groupname: any, Limit: any, NextToken: any): Promise<import("@aws-sdk/client-cognito-identity-provider").ListUsersInGroupCommandOutput>;
    #private;
}
//# sourceMappingURL=index.d.ts.map