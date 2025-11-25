"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const investec_1 = require("../util/investec");
const model_1 = require("../util/model");
const Account_1 = require("./Account");
const Card_1 = require("./Card");
class Client {
    static create(clientId, clientSecret, apiKey, baseUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new Client((0, investec_1.createInvestecAPIClient)(baseUrl), clientId, clientSecret, apiKey);
            yield client.authenticate();
            return client;
        });
    }
    get ApiClient() {
        return this.apiClient;
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let response;
            if ((_a = this.token) === null || _a === void 0 ? void 0 : _a.refresh_token) {
                response = yield this.apiClient.refreshInvestecOAuthToken(this.clientId, this.clientSecret, this.token.refresh_token);
            }
            else {
                response = yield this.apiClient.getInvestecToken(this.clientId, this.clientSecret, this.apiKey);
            }
            if ((0, model_1.isResponseBad)(response)) {
                throw new Error(`bad response from investec auth: ${response}`);
            }
            this.token = response;
        });
    }
    getAuthRedirect(redirectUrl, scope) {
        return encodeURI(this.apiClient.getInvestecOAuthRedirectUrl(this.clientId, scope, redirectUrl));
    }
    getOAuthClientFromToken(token) {
        return new Client(this.apiClient, this.clientId, this.clientSecret, this.apiKey, token);
    }
    getOAuthClient(authCode, redirectUri) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.apiClient.getInvestecOAuthToken(this.clientId, this.clientSecret, this.apiKey, authCode, redirectUri);
            if ((0, model_1.isResponseBad)(response)) {
                throw new Error(`bad response from investec oauth: ${response}`);
            }
            return new Client(this.apiClient, this.clientId, this.clientSecret, this.apiKey, response);
        });
    }
    /**
     * Get a list of accounts.
     * @param realm private/business
     */
    getAccounts() {
        return __awaiter(this, arguments, void 0, function* (realm = "private") {
            if (!this.token) {
                throw new Error("client is not set up");
            }
            const accounts = yield this.apiClient.getInvestecAccounts(this.token.access_token, realm);
            if ((0, model_1.isResponseBad)(accounts)) {
                throw new Error(`not ok response from getting accounts: ${JSON.stringify(accounts)}`);
            }
            return accounts.data.accounts.map((a) => new Account_1.Account(this, a, realm));
        });
    }
    /**
     * Get a list of cards.
     */
    getCards() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!this.token) {
                throw new Error("client is not set up");
            }
            const cards = yield this.apiClient.getInvestecCards(this.token.access_token);
            if ((0, model_1.isResponseBad)(cards)) {
                throw new Error("not ok response from getting cards: " + cards);
            }
            return (_c = (_b = (_a = cards.data) === null || _a === void 0 ? void 0 : _a.cards) === null || _b === void 0 ? void 0 : _b.map((c) => new Card_1.Card(this, c))) !== null && _c !== void 0 ? _c : [];
        });
    }
    /**
     * Get the balance of an account.
     * @param accountId
     * @param realm private/business
     */
    getAccountBalance(accountId_1) {
        return __awaiter(this, arguments, void 0, function* (accountId, realm = "private") {
            if (!this.token) {
                throw new Error("client is not set up");
            }
            const balance = yield this.ApiClient.getAccountBalance(this.token.access_token, accountId, realm);
            if ((0, model_1.isResponseBad)(balance)) {
                throw new Error(`not ok response while getting account balance: ${{
                    accountId: accountId,
                    response: balance,
                }}`);
            }
            return balance.data;
        });
    }
    /**
     * Get a list of transactions for an account.
     * @param accountId
     * @param realm private/business
     * @param fromDate
     * @param toDate
     * @param transactionType
     */
    getPostedTransactions(accountId_1) {
        return __awaiter(this, arguments, void 0, function* (accountId, realm = "private", { fromDate, toDate, transactionType, }) {
            if (!this.token) {
                throw new Error("client is not set up");
            }
            const transactions = yield this.ApiClient.getInvestecTransactionsForAccount(this.token.access_token, { accountId: accountId, fromDate, toDate, transactionType }, realm);
            if ((0, model_1.isResponseBad)(transactions)) {
                throw new Error(`not ok response while getting transactions for account: ${{
                    accountId: accountId,
                    response: transactions,
                }}`);
            }
            return transactions.data.transactions;
        });
    }
    /**
     * Get a list of pending transactions for an account.
     * @param accountId
     * @param realm private/business
     */
    getPendingTransactions(accountId_1) {
        return __awaiter(this, arguments, void 0, function* (accountId, realm = "private") {
            if (!this.token) {
                throw new Error("client is not set up");
            }
            const transactions = yield this.ApiClient.getInvestecPendingTransactionsForAccount(this.token.access_token, accountId, realm);
            if ((0, model_1.isResponseBad)(transactions)) {
                throw new Error(`not ok response while getting transactions for account: ${{
                    accountId: accountId,
                    response: transactions,
                }}`);
            }
            return transactions.data.transactions;
        });
    }
    /**
     * Get all transactions for an account.
     * @param accountId
     * @param realm private/business
     * @param fromDate
     * @param toDate
     * @param transactionType
     */
    getAllTransactions(accountId_1) {
        return __awaiter(this, arguments, void 0, function* (accountId, realm = "private", { fromDate, toDate, transactionType, }) {
            const [pending, posted] = yield Promise.all([yield this.getPendingTransactions(accountId, realm), yield this.getPostedTransactions(accountId, realm, {
                    fromDate,
                    toDate,
                    transactionType
                })]);
            return [...pending, ...posted];
        });
    }
    /**
     * Transfer funds from one account to another.
     * @param fromAccountId
     * @param recipients
     * @param realm private/business
     */
    transfer(fromAccountId_1, recipients_1) {
        return __awaiter(this, arguments, void 0, function* (fromAccountId, recipients, realm = "private") {
            if (!this.token) {
                throw new Error("client is not set up");
            }
            const transferResponse = yield this.ApiClient.postInvestecTransferMultiple(this.token.access_token, {
                fromAccountId: fromAccountId,
                toAccounts: recipients.map((r) => ({
                    accountId: r.account.accountId,
                    amount: r.amount,
                    myReference: r.myReference,
                    theirReference: r.theirReference,
                })),
            }, realm);
            if ((0, model_1.isResponseBad)(transferResponse)) {
                throw new Error(`not ok response while performing transfer for account: ${{
                    accountId: fromAccountId,
                    response: transferResponse,
                }}`);
            }
            return transferResponse.data.TransferResponses;
        });
    }
    /**
     * Pay beneficiaries from an account.
     * @param accountId
     * @param recipients array of beneficiaries to pay
     * @param realm private/business
     */
    pay(accountId_1, recipients_1) {
        return __awaiter(this, arguments, void 0, function* (accountId, recipients, realm = "private") {
            if (!this.token) {
                throw new Error("client is not set up");
            }
            const transferResponse = yield this.ApiClient.postInvestecPayMultiple(this.token.access_token, {
                fromAccountId: accountId,
                toBeneficiaries: recipients.map((r) => ({
                    beneficiaryId: r.beneficiary.beneficiaryId,
                    amount: r.amount,
                    myReference: r.myReference,
                    theirReference: r.theirReference,
                })),
            }, realm);
            if ((0, model_1.isResponseBad)(transferResponse)) {
                throw new Error(`not ok response while performing transfer for account: ${{
                    accountId: accountId,
                    response: transferResponse,
                }}`);
            }
            return transferResponse.data.TransferResponses;
        });
    }
    /**
     * Get a list of beneficiaries.
     */
    getBeneficiaries() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token) {
                throw new Error("client is not set up");
            }
            const beneficiaries = yield this.apiClient.getInvestecBeneficiaries(this.token.access_token);
            if ((0, model_1.isResponseBad)(beneficiaries)) {
                throw new Error("not ok response from getting cards: " + beneficiaries);
            }
            return beneficiaries.data;
        });
    }
    /**
     * Get a list of beneficiary categories.
     */
    getBeneficiaryCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.token) {
                throw new Error("client is not set up");
            }
            const beneficiaries = yield this.apiClient.getInvestecBeneficiaryCategories(this.token.access_token);
            if ((0, model_1.isResponseBad)(beneficiaries)) {
                throw new Error("not ok response from getting cards: " + beneficiaries);
            }
            return beneficiaries.data;
        });
    }
    constructor(apiClient, clientId, clientSecret, apiKey, token) {
        this.apiClient = apiClient;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.apiKey = apiKey;
        this.token = token;
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map