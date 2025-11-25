import { InvestecAccountBalanceResponse, InvestecAccountPaymentResponse, InvestecAccountPendingTransactionsResponse, InvestecAccountsResponse, InvestecAccountTransactionsResponse, InvestecAccountTransferResponse, InvestecAuthResponse, InvestecBeneficiariesResponse, InvestecBeneficiaryCategoriesResponse, InvestecCardCodeResponse, InvestecCardEnvironmentVariablesResponse, InvestecCardExecutionResponse, InvestecCardNameCodeResponse, InvestecCardsResponse, InvestecSimulateExecutionInput, InvestecTransactionTransactionType, Realm, Scope } from "./model";
export declare const createInvestecAPIClient: (baseUrl?: string) => {
    getInvestecToken: (clientId: string, clientSecret: string, apiKey: string) => Promise<InvestecAuthResponse>;
    getInvestecOAuthToken: (clientId: string, clientSecret: string, apiKey: string, authCode: string, redirectUri: string) => Promise<InvestecAuthResponse>;
    refreshInvestecOAuthToken: (clientId: string, clientSecret: string, refreshToken: string) => Promise<InvestecAuthResponse>;
    getInvestecOAuthRedirectUrl: (clientId: string, scope: Scope[], redirectUri: string) => string;
    getInvestecAccounts: (token: string, realm?: Realm) => Promise<InvestecAccountsResponse>;
    getAccountBalance: (token: string, accountId: string, realm?: Realm) => Promise<InvestecAccountBalanceResponse>;
    getInvestecPendingTransactionsForAccount: (token: string, accountId: string, realm?: Realm) => Promise<InvestecAccountPendingTransactionsResponse>;
    getInvestecTransactionsForAccount: (token: string, { accountId, fromDate, toDate, transactionType, }: {
        accountId: string;
        fromDate?: string;
        toDate?: string;
        transactionType?: InvestecTransactionTransactionType;
    }, realm?: Realm) => Promise<InvestecAccountTransactionsResponse>;
    postInvestecTransferMultiple: (token: string, { fromAccountId, toAccounts, }: {
        fromAccountId: string;
        toAccounts: Array<{
            accountId: string;
            amount: number;
            myReference: string;
            theirReference: string;
        }>;
    }, realm?: Realm) => Promise<InvestecAccountTransferResponse>;
    postInvestecPayMultiple: (token: string, { fromAccountId, toBeneficiaries, }: {
        fromAccountId: string;
        toBeneficiaries: Array<{
            beneficiaryId: string;
            amount: number;
            myReference: string;
            theirReference: string;
        }>;
    }, realm?: Realm) => Promise<InvestecAccountPaymentResponse>;
    getInvestecBeneficiaries: (token: string) => Promise<InvestecBeneficiariesResponse | {
        status: number;
    }>;
    getInvestecBeneficiaryCategories: (token: string) => Promise<InvestecBeneficiaryCategoriesResponse | {
        status: number;
    }>;
    getInvestecCards: (token: string) => Promise<InvestecCardsResponse>;
    getInvestecCardSavedCode: (token: string, cardKey: string) => Promise<InvestecCardCodeResponse>;
    getInvestecCardPublishedCode: (token: string, cardKey: string) => Promise<InvestecCardCodeResponse>;
    postInvestecCardSaveCode: (token: string, cardKey: string, code: string) => Promise<InvestecCardCodeResponse>;
    postInvestecCardPublishSavedCode: (token: string, cardKey: string, codeId: string) => Promise<InvestecCardCodeResponse>;
    postInvestecSimulateExecuteFunctionCode: (token: string, cardKey: string, opts: InvestecSimulateExecutionInput) => Promise<InvestecCardExecutionResponse>;
    getInvestecCardExecutions: (token: string, cardKey: string) => Promise<InvestecCardExecutionResponse>;
    getInvestecCardEnvironmentVariables: (token: string, cardKey: string) => Promise<InvestecCardEnvironmentVariablesResponse>;
    postInvestecCardEnvironmentVariables: (token: string, cardKey: string, variables: { [key in string]: string | number | boolean | Object; }) => Promise<InvestecCardEnvironmentVariablesResponse>;
    getInvestecCardCountries: (token: string) => Promise<InvestecCardNameCodeResponse>;
    getInvestecCardCurrencies: (token: string) => Promise<InvestecCardNameCodeResponse>;
    getInvestecCardMerchants: (token: string) => Promise<InvestecCardNameCodeResponse>;
};
