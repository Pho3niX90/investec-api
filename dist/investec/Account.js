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
exports.Account = void 0;
const camelcase_keys_1 = require("camelcase-keys");
class Account {
    constructor(client, _account, realm) {
        this.client = client;
        const account = (0, camelcase_keys_1.default)(_account);
        this.accountId = account.accountId;
        this.accountNumber = account.accountNumber;
        this.accountName = account.accountName;
        this.referenceName = account.referenceName;
        this.productName = account.productName;
        this.meta = Object.assign({}, _account);
        this.realm = realm;
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.getAccountBalance(this.accountId, this.realm);
        });
    }
    getTransactions(_a) {
        return __awaiter(this, arguments, void 0, function* ({ fromDate, toDate, transactionType, }) {
            return this.client.getPostedTransactions(this.accountId, this.realm, { fromDate, toDate, transactionType });
        });
    }
    getPendingTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.getPendingTransactions(this.accountId, this.realm);
        });
    }
    getAllTransactions(_a) {
        return __awaiter(this, arguments, void 0, function* ({ fromDate, toDate, transactionType, }) {
            return this.client.getAllTransactions(this.accountId, this.realm, { fromDate, toDate, transactionType });
        });
    }
    transfer(recipients) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.transfer(this.accountId, recipients, this.realm);
        });
    }
    pay(recipients) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.pay(this.accountId, recipients, this.realm);
        });
    }
}
exports.Account = Account;
//# sourceMappingURL=Account.js.map