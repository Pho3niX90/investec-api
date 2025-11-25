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
exports.createInvestecAPIClient = void 0;
const node_fetch_1 = require("node-fetch");
const RealmSelector = {
    business: "bb",
    private: "pb",
};
const getBasicHeaders = (token) => {
    return {
        Authorization: `Bearer ${token}`,
    };
};
const safeResponse = (response) => {
    if (response.status !== 200) {
        return { status: response.status };
    }
    return response.json();
};
const createInvestecAPIClient = (baseUrl = "https://openapi.investec.com") => {
    const INVESTEC_BASE_URL = baseUrl;
    return {
        getInvestecToken: (clientId, clientSecret, apiKey) => __awaiter(void 0, void 0, void 0, function* () {
            const tokenResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/identity/v2/oauth2/token`, {
                method: "POST",
                body: `grant_type=client_credentials&scope=accounts`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic  ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")} `,
                    "x-api-key": apiKey,
                },
            });
            return safeResponse(tokenResponse);
        }),
        getInvestecOAuthToken: (clientId, clientSecret, apiKey, authCode, redirectUri) => __awaiter(void 0, void 0, void 0, function* () {
            const tokenResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/identity/v2/oauth2/token`, {
                method: "POST",
                body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${redirectUri}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic  ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")} `,
                    "x-api-key": apiKey,
                },
            });
            return safeResponse(tokenResponse);
        }),
        refreshInvestecOAuthToken: (clientId, clientSecret, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
            const tokenResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/identity/v2/oauth2/token`, {
                method: "POST",
                body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic  ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")} `,
                },
            });
            return safeResponse(tokenResponse);
        }),
        getInvestecOAuthRedirectUrl: (clientId, scope, redirectUri) => {
            return `${INVESTEC_BASE_URL}/identity/v2/oauth2/authorize?scope=${scope.join(" ")}&client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
        },
        getInvestecAccounts: (token_1, ...args_1) => __awaiter(void 0, [token_1, ...args_1], void 0, function* (token, realm = "private") {
            const accountsResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/${RealmSelector[realm]}/v1/accounts`, {
                headers: Object.assign({}, getBasicHeaders(token)),
            });
            return safeResponse(accountsResponse);
        }),
        getAccountBalance: (token_1, accountId_1, ...args_1) => __awaiter(void 0, [token_1, accountId_1, ...args_1], void 0, function* (token, accountId, realm = "private") {
            const balanceResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/${RealmSelector[realm]}/v1/accounts/${accountId}/balance`, {
                headers: Object.assign({}, getBasicHeaders(token)),
            });
            return safeResponse(balanceResponse);
        }),
        getInvestecPendingTransactionsForAccount: (token_1, accountId_1, ...args_1) => __awaiter(void 0, [token_1, accountId_1, ...args_1], void 0, function* (token, accountId, realm = "private") {
            const transactionsResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/${RealmSelector[realm]}/v1/accounts/${accountId}/pending-transactions`, {
                headers: Object.assign({}, getBasicHeaders(token)),
            });
            return safeResponse(transactionsResponse);
        }),
        getInvestecTransactionsForAccount: (token_1, _a, ...args_1) => __awaiter(void 0, [token_1, _a, ...args_1], void 0, function* (token, { accountId, fromDate, toDate, transactionType, }, realm = "private") {
            const transactionsResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/${RealmSelector[realm]}/v1/accounts/${accountId}/transactions?${fromDate ? ` &fromDate=${fromDate}` : ""}${toDate ? `&toDate=${toDate}` : ""}
        ${transactionType ? `&transactionType=${transactionType}` : ""}`, {
                headers: Object.assign({}, getBasicHeaders(token)),
            });
            return safeResponse(transactionsResponse);
        }),
        postInvestecTransferMultiple: (token_1, _a, ...args_1) => __awaiter(void 0, [token_1, _a, ...args_1], void 0, function* (token, { fromAccountId, toAccounts, }, realm = "private") {
            const body = {
                transferList: toAccounts.map((t) => ({
                    beneficiaryAccountId: t.accountId,
                    amount: t.amount,
                    myReference: t.myReference,
                    theirReference: t.theirReference,
                })),
            };
            const transferResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/${RealmSelector[realm]}/v1/accounts/${fromAccountId}/transfermultiple`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: Object.assign({ "Content-Type": "application/json" }, getBasicHeaders(token)),
            });
            return safeResponse(transferResponse);
        }),
        postInvestecPayMultiple: (token_1, _a, ...args_1) => __awaiter(void 0, [token_1, _a, ...args_1], void 0, function* (token, { fromAccountId, toBeneficiaries, }, realm = "private") {
            const body = {
                paymentList: toBeneficiaries,
            };
            const transferResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/${RealmSelector[realm]}/v1/accounts/${fromAccountId}/paymultiple`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: Object.assign({ "Content-Type": "application/json" }, getBasicHeaders(token)),
            });
            return safeResponse(transferResponse);
        }),
        getInvestecBeneficiaries: (token) => __awaiter(void 0, void 0, void 0, function* () {
            const beneficiariesResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/pb/v1/accounts/beneficiaries`, {
                headers: Object.assign({}, getBasicHeaders(token)),
            });
            return safeResponse(beneficiariesResponse);
        }),
        getInvestecBeneficiaryCategories: (token) => __awaiter(void 0, void 0, void 0, function* () {
            const beneficiariesResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/pb/v1/accounts/beneficiarycategories`, {
                headers: Object.assign({}, getBasicHeaders(token)),
            });
            return safeResponse(beneficiariesResponse);
        }),
        getInvestecCards: (token) => __awaiter(void 0, void 0, void 0, function* () {
            const cardsResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/v1/cards`, {
                headers: Object.assign({}, getBasicHeaders(token)),
            });
            return safeResponse(cardsResponse);
        }),
        getInvestecCardSavedCode: (token, cardKey) => __awaiter(void 0, void 0, void 0, function* () {
            const cardsResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/v1/cards/${cardKey}/code`, {
                headers: Object.assign({}, getBasicHeaders(token)),
            });
            return safeResponse(cardsResponse);
        }),
        getInvestecCardPublishedCode: (token, cardKey) => __awaiter(void 0, void 0, void 0, function* () {
            const cardsResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/v1/cards/${cardKey}/publishedcode`, {
                headers: Object.assign({}, getBasicHeaders(token)),
            });
            return safeResponse(cardsResponse);
        }),
        postInvestecCardSaveCode: (token, cardKey, code) => __awaiter(void 0, void 0, void 0, function* () {
            const body = { code };
            const response = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/v1/cards/${cardKey}/code`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: Object.assign({ "Content-Type": "application/json" }, getBasicHeaders(token)),
            });
            return safeResponse(response);
        }),
        postInvestecCardPublishSavedCode: (token, cardKey, codeId) => __awaiter(void 0, void 0, void 0, function* () {
            const body = { codeid: codeId, code: "" };
            const response = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/v1/cards/${cardKey}/code`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: Object.assign({ "Content-Type": "application/json" }, getBasicHeaders(token)),
            });
            return safeResponse(response);
        }),
        postInvestecSimulateExecuteFunctionCode: (token, cardKey, opts) => __awaiter(void 0, void 0, void 0, function* () {
            const body = Object.assign({}, opts);
            const response = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/v1/cards/${cardKey}/code/execute`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: Object.assign({ "Content-Type": "application/json" }, getBasicHeaders(token)),
            });
            return safeResponse(response);
        }),
        getInvestecCardExecutions: (token, cardKey) => __awaiter(void 0, void 0, void 0, function* () {
            const cardsResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/v1/cards/${cardKey}/code/executions`, {
                headers: Object.assign({}, getBasicHeaders(token)),
            });
            return safeResponse(cardsResponse);
        }),
        getInvestecCardEnvironmentVariables: (token, cardKey) => __awaiter(void 0, void 0, void 0, function* () {
            const envResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/v1/cards/${cardKey}/environmentvariables`, {
                headers: Object.assign({}, getBasicHeaders(token)),
            });
            return safeResponse(envResponse);
        }),
        postInvestecCardEnvironmentVariables: (token, cardKey, variables) => __awaiter(void 0, void 0, void 0, function* () {
            const body = { variables };
            const response = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/v1/cards/${cardKey}/environmentvariables`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: Object.assign({ "Content-Type": "application/json" }, getBasicHeaders(token)),
            });
            return safeResponse(response);
        }),
        getInvestecCardCountries: (token) => __awaiter(void 0, void 0, void 0, function* () {
            const envResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/v1/cards/countries`, {
                headers: Object.assign({}, getBasicHeaders(token)),
            });
            return safeResponse(envResponse);
        }),
        getInvestecCardCurrencies: (token) => __awaiter(void 0, void 0, void 0, function* () {
            const envResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/v1/cards/currencies`, {
                headers: Object.assign({}, getBasicHeaders(token)),
            });
            return safeResponse(envResponse);
        }),
        getInvestecCardMerchants: (token) => __awaiter(void 0, void 0, void 0, function* () {
            const envResponse = yield (0, node_fetch_1.default)(`${INVESTEC_BASE_URL}/za/v1/cards/merchants`, {
                headers: Object.assign({}, getBasicHeaders(token)),
            });
            return safeResponse(envResponse);
        }),
    };
};
exports.createInvestecAPIClient = createInvestecAPIClient;
//# sourceMappingURL=investec.js.map