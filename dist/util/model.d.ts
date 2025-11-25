export type InvestecTransactionType = "DEBIT" | "CREDIT";
export type InvestecTransactionTransactionType = "CardPurchases" | "VASTransactions" | "OnlineBankingPayments" | "DebitOrders" | "Deposits" | "ATMWithdrawals" | "FeesAndInterest" | "FasterPay" | string | null;
export type InvestecTransactionStatus = string;
export interface InvestecAccount {
    accountId: string;
    accountNumber: string;
    accountName: string;
    referenceName: string;
    productName: string;
    meta: any;
}
export interface InvestecCard {
    CardKey: string;
    CardNumber: string;
    IsProgrammable: boolean;
    Status: string;
    CardTypeCode: string;
    AccountNumber: string;
    AccountId: string;
}
export interface InvestecCardCode {
    codeId: string;
    code: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    error: any;
}
export interface InvestecSimulateExecutionInput {
    code: string;
    centsAmount: string;
    currencyCode: string;
    merchantCode: number;
    merchantCity: string;
    countryCode: string;
}
export interface InvestecCardExecution {
    executionId: string;
    rootCodeFunctionId: string;
    sandbox: boolean;
    type: "before_transaction" | "after_transaction";
    authorizationApproved: boolean | null;
    logs: Array<{
        createdAt: string;
        level: string;
        content: string;
    }>;
    smsCount: number;
    emailCount: number;
    pushNotificationCount: number;
    createdAt: string;
    startedAt: string;
    completedAt: string;
    updatedAt: string;
    Error: any;
}
export interface InvestecCardEnvironmentVariables {
    variables: {
        [key in string]: string | number | boolean | Object;
    };
    createdAt: string;
    updatedAt: string;
    error: any;
}
export interface InvestecNameAndCode {
    Code: string;
    Name: string;
}
export interface InvestecAccountBalance {
    accountId: string;
    currentBalance: number;
    availableBalance: number;
    currency: string;
}
export interface InvestecPostedTransaction extends InvestecPendingTransaction {
    transactionType: InvestecTransactionTransactionType;
    cardNumber: string;
    postedOrder: number;
    postingDate: string;
    valueDate: string;
    actionDate: string;
    runningBalance: number;
}
export interface InvestecPendingTransaction {
    accountId: string;
    type: InvestecTransactionType;
    status: 'PENDING' | 'POSTED' | 'FAILED';
    description: string;
    transactionDate: string;
    amount: number;
}
export interface InvestecTransfer {
    PaymentReferenceNumber: string;
    PaymentDate: string;
    Status: string;
    BeneficiaryName: string;
    BeneficiaryAccountId: string;
    AuthorisationRequired: boolean;
}
export interface InvestecPayment {
    PaymentReferenceNumber: string;
    PaymentDate: string;
    Status: string;
    BeneficiaryName: string;
    BeneficiaryAccountId: string;
    AuthorisationRequired: boolean;
}
export interface InvestecBeneficiary {
    beneficiaryId: string;
    accountNumber: string;
    code: string;
    bank: string;
    beneficiaryName: string;
    lastPaymentAmount: string;
    lastPaymentDate: string;
    cellNo: string;
    emailAddress: string;
    name: string;
    referenceAccountNumber: string;
    referenceName: string;
    categoryId: string;
    profileId: string;
}
export interface InvestecBeneficiaryCategory {
    id: string;
    isDefault: string;
    name: string;
}
type Status = {
    status: number;
};
type InvestecGenericOKResponse<Data> = {
    data: Data;
    links: {
        self: string | null;
    };
    meta: {
        totalPages: number;
    };
};
type InvestecGenericResponse<Data> = Status | InvestecGenericOKResponse<Data>;
export type Realm = "business" | "private";
export type Scope = "accounts" | "transactions";
export type InvestecAuthResponse = Status | InvestecToken;
export type InvestecToken = {
    access_token: string;
    token_type: "Bearer";
    expires_in: number;
    scope: Scope;
    refresh_token?: string;
};
export type InvestecAccountsResponse = InvestecGenericResponse<{
    accounts: InvestecAccount[];
}>;
export type InvestecAccountBalanceResponse = InvestecGenericResponse<InvestecAccountBalance>;
export type InvestecAccountTransactionsResponse = InvestecGenericResponse<{
    transactions: InvestecPostedTransaction[];
}>;
export type InvestecAccountPendingTransactionsResponse = InvestecGenericResponse<{
    transactions: InvestecPendingTransaction[];
}>;
export type InvestecAccountTransferResponse = InvestecGenericResponse<{
    TransferResponses: InvestecTransfer[];
    ErrorMessage: any;
}>;
export type InvestecAccountPaymentResponse = InvestecGenericResponse<{
    TransferResponses: InvestecPayment[];
    ErrorMessage: string;
}>;
export type InvestecBeneficiariesResponse = InvestecGenericResponse<InvestecBeneficiary[]>;
export type InvestecBeneficiaryCategoriesResponse = InvestecGenericResponse<InvestecBeneficiaryCategory[]>;
export type InvestecCardsResponse = InvestecGenericResponse<{
    cards: InvestecCard[];
}>;
export type InvestecCardCodeResponse = InvestecGenericResponse<{
    result: InvestecCardCode;
}>;
export type InvestecCardExecutionResponse = InvestecGenericResponse<{
    result: InvestecCardExecution[];
}>;
export type InvestecCardEnvironmentVariablesResponse = InvestecGenericResponse<{
    result: InvestecCardEnvironmentVariables;
}>;
export type InvestecCardNameCodeResponse = InvestecGenericResponse<{
    result: InvestecNameAndCode[];
}>;
export declare const isResponseBad: (response: any) => response is Status;
export {};
