import { createInvestecAPIClient } from "../util/investec";
import { InvestecBeneficiary, InvestecBeneficiaryCategory, InvestecPayment, InvestecPendingTransaction, InvestecPostedTransaction, InvestecToken, InvestecTransactionTransactionType, InvestecTransfer, Realm, Scope } from "../util/model";
import { Account } from "./Account";
import { Card } from "./Card";
export declare class Client {
    private apiClient;
    private clientId;
    private clientSecret;
    private apiKey;
    token?: InvestecToken | undefined;
    static create(clientId: string, clientSecret: string, apiKey: string, baseUrl?: string): Promise<Client>;
    get ApiClient(): ReturnType<typeof createInvestecAPIClient>;
    authenticate(): Promise<void>;
    getAuthRedirect(redirectUrl: string, scope: Scope[]): string;
    getOAuthClientFromToken(token: InvestecToken): Client;
    getOAuthClient(authCode: string, redirectUri: string): Promise<Client>;
    /**
     * Get a list of accounts.
     * @param realm private/business
     */
    getAccounts(realm?: Realm): Promise<Account[]>;
    /**
     * Get a list of cards.
     */
    getCards(): Promise<Card[]>;
    /**
     * Get the balance of an account.
     * @param accountId
     * @param realm private/business
     */
    getAccountBalance(accountId: string, realm?: Realm): Promise<import("../util/model").InvestecAccountBalance>;
    /**
     * Get a list of transactions for an account.
     * @param accountId
     * @param realm private/business
     * @param fromDate
     * @param toDate
     * @param transactionType
     */
    getPostedTransactions(accountId: string, realm: Realm | undefined, { fromDate, toDate, transactionType, }: {
        fromDate?: string;
        toDate?: string;
        transactionType?: InvestecTransactionTransactionType;
    }): Promise<InvestecPostedTransaction[]>;
    /**
     * Get a list of pending transactions for an account.
     * @param accountId
     * @param realm private/business
     */
    getPendingTransactions(accountId: string, realm?: Realm): Promise<InvestecPendingTransaction[]>;
    /**
     * Get all transactions for an account.
     * @param accountId
     * @param realm private/business
     * @param fromDate
     * @param toDate
     * @param transactionType
     */
    getAllTransactions(accountId: string, realm: Realm | undefined, { fromDate, toDate, transactionType, }: {
        fromDate?: string;
        toDate?: string;
        transactionType?: InvestecTransactionTransactionType;
    }): Promise<(InvestecPostedTransaction | InvestecPendingTransaction)[]>;
    /**
     * Transfer funds from one account to another.
     * @param fromAccountId
     * @param recipients
     * @param realm private/business
     */
    transfer(fromAccountId: string, recipients: Array<{
        account: Account;
        myReference: string;
        theirReference: string;
        amount: number;
    }>, realm?: Realm): Promise<InvestecTransfer[]>;
    /**
     * Pay beneficiaries from an account.
     * @param accountId
     * @param recipients array of beneficiaries to pay
     * @param realm private/business
     */
    pay(accountId: string, recipients: Array<{
        beneficiary: InvestecBeneficiary;
        myReference: string;
        theirReference: string;
        amount: number;
    }>, realm?: Realm): Promise<InvestecPayment[]>;
    /**
     * Get a list of beneficiaries.
     */
    getBeneficiaries(): Promise<InvestecBeneficiary[]>;
    /**
     * Get a list of beneficiary categories.
     */
    getBeneficiaryCategories(): Promise<InvestecBeneficiaryCategory[]>;
    private constructor();
}
