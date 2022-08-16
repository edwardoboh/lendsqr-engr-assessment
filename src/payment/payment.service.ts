import debug from 'debug'
import axios from 'axios'
import { Knex } from 'knex'
import knex from '../database'
import { payment_integration as PI } from '../config/app'
import logger from '../common/logger'

class PaymentService {

    Payment: Knex.QueryBuilder<any, any>;
    log: debug.IDebugger;

    constructor() {
        this.Payment = knex('payments');
        this.log = logger('Payment Service: ');
    }

    // Fetch the details of a payment from its reference
    async getPayment(payment_reference: string) {
        return this.Payment.select().where({ payment_reference }).first();
    }

    // Save a payment to database - to keep track of all resolved payments
    async addPayment(paymentData: any, username: string) {

        return this.Payment.insert({
            username,
            payment_reference: paymentData['data']['reference'],
            amount: paymentData['data']['amount'] / 100,
            status: paymentData['data']['status'],
            payment_data: JSON.stringify(paymentData),
        }, ['payment_reference', 'amount', 'status'])
            .first()
    }

    // verify a payment from the provided reference
    async verifyPayment(payment_reference: string) {
        const verify_url = `${PI.verification_url}${payment_reference}`
        const config = {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${PI.secret_key}`
            }
        }
        try {
            const [paymentData, payment_exist] = await Promise.all([
                axios.get(verify_url, config),
                this.getPayment(payment_reference)
            ])

            if (payment_exist) {
                throw new Error("Payment Has already been resolved");
            }

            if (paymentData.data['data']['status'] == 'success') {
                return paymentData.data
            }

        } catch (error: any) {
            this.log(error.message)
        }
    }

    // Send funds from a user's wallet to their bank account
    async bankTransfer(wihtdrawalData: any) {

        // Integrate with the payment system and perform the transfer
        return {
            amount: 2000,
            status: 'success',
            bank_data: "{}",
            transfer_reference: "refr_12xyz3"
        }
    }
}

export default new PaymentService();