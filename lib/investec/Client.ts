import {createInvestecAPIClient} from "../util/investec";
import {
    InvestecAuthResponse,
    InvestecBeneficiary,
    InvestecBeneficiaryCategory,
    InvestecPayment,
    InvestecPendingTransaction,
    InvestecPostedTransaction,
    InvestecToken,
    InvestecTransactionTransactionType,
    InvestecTransfer,
    isResponseBad,
    Realm,
    Scope,
} from "../util/model";
import {Account} from "./Account";
import {Card} from "./Card";

export class Client {
    public static async create(
        clientId: string,
        clientSecret: string,
        apiKey: string,
        baseUrl?: string
    ) {
        const client = new Client(
            createInvestecAPIClient(baseUrl),
            clientId,
            clientSecret,
            apiKey
        );
        await client.authenticate();
        return client;
    }

    get ApiClient(): ReturnType<typeof createInvestecAPIClient> {
        return this.apiClient;
    }

    public async authenticate() {
        let response: InvestecAuthResponse;
        if (this.token?.refresh_token) {
            response = await this.apiClient.refreshInvestecOAuthToken(
                this.clientId,
                this.clientSecret,
                this.token.refresh_token
            );
        } else {
            response = await this.apiClient.getInvestecToken(
                this.clientId,
                this.clientSecret,
                this.apiKey
            );
        }

        if (isResponseBad(response)) {
            throw new Error(`bad response from investec auth: ${response}`);
        }
        this.token = response;
    }

    public getAuthRedirect(redirectUrl: string, scope: Scope[]): string {
        return encodeURI(
            this.apiClient.getInvestecOAuthRedirectUrl(
                this.clientId,
                scope,
                redirectUrl
            )
        );
    }

    public getOAuthClientFromToken(token: InvestecToken) {
        return new Client(
            this.apiClient,
            this.clientId,
            this.clientSecret,
            this.apiKey,
            token
        );
    }

    public async getOAuthClient(
        authCode: string,
        redirectUri: string
    ): Promise<Client> {
        const response = await this.apiClient.getInvestecOAuthToken(
            this.clientId,
            this.clientSecret,
            this.apiKey,
            authCode,
            redirectUri
        );
        if (isResponseBad(response)) {
            throw new Error(`bad response from investec oauth: ${response}`);
        }
        return new Client(
            this.apiClient,
            this.clientId,
            this.clientSecret,
            this.apiKey,
            response
        );
    }

    /**
     * Get a list of accounts.
     * @param realm private/business
     */
    public async getAccounts(realm: Realm = "private"): Promise<Account[]> {
        if (!this.token) {
            throw new Error("client is not set up");
        }
        const accounts = await this.apiClient.getInvestecAccounts(
            this.token.access_token,
            realm
        );
        if (isResponseBad(accounts)) {
            throw new Error(
                `not ok response from getting accounts: ${JSON.stringify(accounts)}`
            );
        }
        return accounts.data.accounts.map((a) => new Account(this, a, realm));
    }

    /**
     * Get a list of cards.
     */
    public async getCards(): Promise<Card[]> {
        if (!this.token) {
            throw new Error("client is not set up");
        }
        const cards = await this.apiClient.getInvestecCards(
            this.token.access_token
        );
        if (isResponseBad(cards)) {
            throw new Error("not ok response from getting cards: " + cards);
        }
        return cards.data?.cards?.map((c) => new Card(this, c)) ?? [];
    }

    /**
     * Get the balance of an account.
     * @param accountId
     * @param realm private/business
     */
    public async getAccountBalance(accountId: string, realm: Realm = "private") {
        if (!this.token) {
            throw new Error("client is not set up");
        }
        const balance = await this.ApiClient.getAccountBalance(
            this.token.access_token,
            accountId,
            realm
        );
        if (isResponseBad(balance)) {
            throw new Error(
                `not ok response while getting account balance: ${{
                    accountId: accountId,
                    response: balance,
                }}`
            );
        }
        return balance.data;
    }

    /**
     * Get a list of transactions for an account.
     * @param accountId
     * @param realm private/business
     * @param fromDate
     * @param toDate
     * @param transactionType
     */
    public async getPostedTransactions(accountId: string, realm: Realm = "private", {
        fromDate,
        toDate,
        transactionType,
    }: {
        fromDate?: string;
        toDate?: string;
        transactionType?: InvestecTransactionTransactionType;
    }): Promise<InvestecPostedTransaction[]> {
        if (!this.token) {
            throw new Error("client is not set up");
        }
        const transactions =
            await this.ApiClient.getInvestecTransactionsForAccount(
                this.token.access_token,
                {accountId: accountId, fromDate, toDate, transactionType},
                realm
            );
        if (isResponseBad(transactions)) {
            throw new Error(
                `not ok response while getting transactions for account: ${{
                    accountId: accountId,
                    response: transactions,
                }}`
            );
        }
        return transactions.data.transactions;
    }

    /**
     * Get a list of pending transactions for an account.
     * @param accountId
     * @param realm private/business
     */
    public async getPendingTransactions(accountId: string, realm: Realm = "private"): Promise<InvestecPendingTransaction[]> {
        if (!this.token) {
            throw new Error("client is not set up");
        }
        const transactions =
            await this.ApiClient.getInvestecPendingTransactionsForAccount(
                this.token.access_token,
                accountId,
                realm
            );
        if (isResponseBad(transactions)) {
            throw new Error(
                `not ok response while getting transactions for account: ${{
                    accountId: accountId,
                    response: transactions,
                }}`
            );
        }
        return transactions.data.transactions;
    }

    /**
     * Get all transactions for an account.
     * @param accountId
     * @param realm private/business
     * @param fromDate
     * @param toDate
     * @param transactionType
     */
    public async getAllTransactions(accountId: string, realm: Realm = "private", {
        fromDate,
        toDate,
        transactionType,
    }: {
        fromDate?: string;
        toDate?: string;
        transactionType?: InvestecTransactionTransactionType;
    }): Promise<(InvestecPostedTransaction | InvestecPendingTransaction)[]> {
        const [pending, posted] = await Promise.all([await this.getPendingTransactions(accountId, realm), await this.getPostedTransactions(accountId, realm, {
            fromDate,
            toDate,
            transactionType
        })])
        return [...pending, ...posted];
    }

    /**
     * Transfer funds from one account to another.
     * @param fromAccountId
     * @param recipients
     * @param realm private/business
     */
    public async transfer(
        fromAccountId: string,
        recipients: Array<{
            account: Account;
            myReference: string;
            theirReference: string;
            amount: number;
        }>,
        realm: Realm = "private"
    ): Promise<InvestecTransfer[]> {
        if (!this.token) {
            throw new Error("client is not set up");
        }
        const transferResponse =
            await this.ApiClient.postInvestecTransferMultiple(
                this.token.access_token,
                {
                    fromAccountId: fromAccountId,
                    toAccounts: recipients.map((r) => ({
                        accountId: r.account.accountId,
                        amount: r.amount,
                        myReference: r.myReference,
                        theirReference: r.theirReference,
                    })),
                },
                realm
            );
        if (isResponseBad(transferResponse)) {
            throw new Error(
                `not ok response while performing transfer for account: ${{
                    accountId: fromAccountId,
                    response: transferResponse,
                }}`
            );
        }
        return transferResponse.data.TransferResponses;
    }

    /**
     * Pay beneficiaries from an account.
     * @param accountId
     * @param recipients array of beneficiaries to pay
     * @param realm private/business
     */
    public async pay(
        accountId: string,
        recipients: Array<{
            beneficiary: InvestecBeneficiary;
            myReference: string;
            theirReference: string;
            amount: number;
        }>,
        realm: Realm = "private"
    ): Promise<InvestecPayment[]> {
        if (!this.token) {
            throw new Error("client is not set up");
        }
        const transferResponse =
            await this.ApiClient.postInvestecPayMultiple(
                this.token.access_token,
                {
                    fromAccountId: accountId,
                    toBeneficiaries: recipients.map((r) => ({
                        beneficiaryId: r.beneficiary.beneficiaryId,
                        amount: r.amount,
                        myReference: r.myReference,
                        theirReference: r.theirReference,
                    })),
                },
                realm
            );
        if (isResponseBad(transferResponse)) {
            throw new Error(
                `not ok response while performing transfer for account: ${{
                    accountId: accountId,
                    response: transferResponse,
                }}`
            );
        }
        return transferResponse.data.TransferResponses;
    }

    /**
     * Get a list of beneficiaries.
     */
    public async getBeneficiaries(): Promise<InvestecBeneficiary[]> {
        if (!this.token) {
            throw new Error("client is not set up");
        }
        const beneficiaries = await this.apiClient.getInvestecBeneficiaries(
            this.token.access_token
        );
        if (isResponseBad(beneficiaries)) {
            throw new Error("not ok response from getting cards: " + beneficiaries);
        }
        return beneficiaries.data;
    }

    /**
     * Get a list of beneficiary categories.
     */
    public async getBeneficiaryCategories(): Promise<
        InvestecBeneficiaryCategory[]
    > {
        if (!this.token) {
            throw new Error("client is not set up");
        }
        const beneficiaries = await this.apiClient.getInvestecBeneficiaryCategories(
            this.token.access_token
        );
        if (isResponseBad(beneficiaries)) {
            throw new Error("not ok response from getting cards: " + beneficiaries);
        }
        return beneficiaries.data;
    }

    private constructor(
        private apiClient: ReturnType<typeof createInvestecAPIClient>,
        private clientId: string,
        private clientSecret: string,
        private apiKey: string,
        public token?: InvestecToken
    ) {
    }
}
