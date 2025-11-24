import {Client, InvestecPendingTransaction} from "..";
import {
    InvestecAccount,
    InvestecBeneficiary,
    InvestecPayment,
    InvestecTransaction,
    InvestecTransactionTransactionType,
    InvestecTransfer,
    Realm,
} from "../util/model";
import camelcaseKeys from 'camelcase-keys';

export class Account implements InvestecAccount {
    public accountId: string;
    public accountNumber: string;
    public accountName: string;
    public referenceName: string;
    public productName: string;
    public realm: Realm;
    public meta: any;

    constructor(private client: Client, _account: InvestecAccount, realm: Realm) {
        const account = camelcaseKeys(_account);
        this.accountId = account.accountId;
        this.accountNumber = account.accountNumber;
        this.accountName = account.accountName;
        this.referenceName = account.referenceName;
        this.productName = account.productName;
        this.meta = {..._account};
        this.realm = realm;
    }

    public async getBalance() {
        return this.client.getAccountBalance(this.accountId, this.realm);
    }

    public async getTransactions({
                                     fromDate,
                                     toDate,
                                     transactionType,
                                 }: {
        fromDate?: string;
        toDate?: string;
        transactionType?: InvestecTransactionTransactionType;
    }): Promise<InvestecTransaction[]> {
        return this.client.getTransactions(this.accountId, this.realm, {fromDate, toDate, transactionType});
    }

    public async getPendingTransactions(): Promise<InvestecPendingTransaction[]> {
        return this.client.getPendingTransactions(this.accountId, this.realm);
    }

    public async transfer(
        recipients: Array<{
            account: Account;
            myReference: string;
            theirReference: string;
            amount: number;
        }>
    ): Promise<InvestecTransfer[]> {
        return this.client.transfer(this.accountId, recipients, this.realm);
    }

    public async pay(
        recipients: Array<{
            beneficiary: InvestecBeneficiary;
            myReference: string;
            theirReference: string;
            amount: number;
        }>
    ): Promise<InvestecPayment[]> {
        return this.client.pay(this.accountId, recipients, this.realm);
    }
}
