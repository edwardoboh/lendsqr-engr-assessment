![Lendsqr Logo](http://www.orb-digital.com/images/icons/logo-pills/lendsqr.svg)

# **Backend Engineer Assessment**

#### **Submission Links**

- Postman Documentation: [Click Here](https://documenter.getpostman.com/view/17453703/VUjTiNUP)
- API Production Link: [lendsqr-edwardoboh.herokuapp.com](https://lendsqr-edwardoboh.herokuapp.com/)
- Github Repository: [edwardoboh/lendsqr-engr-assessment](https://github.com/edwardoboh/lendsqr-engr-assessment)

---

This documnets provides information about my implementation of the Lendsqr Engineering Assessment
which requires that i build a product that allows its users the ability to:

- create an account
- fund their account
- transfer funds to another user’s account
- withdraw funds from their account.

The document is divided into several sections, listed below

## **High Level System Design**

The diagram below shows the various components of the system as can be infered from its requirements.

![high level diagram](https://res.cloudinary.com/class-attend/image/upload/v1660737498/class-attend/high_level_diagram_gllicu.jpg)

The API services users request from both mobile and web platforms.The diagram above is a simplified representation of the system.
In reality, several components exist between those shown. For example,

There exists a DNS server that routes user request to our system, a Load Balancer (which might also function as a reverse proxy) could be placed between the user and the web server. Several caching layers could also exist in the system, to avoid overloading and enable quick delivery of data.

The database system used here is MySQL. For my implementation of this system, this database runs inside of a Docker Container and the Docker Compose file can be found in the root of the project folder.

## **Design Assumptions**

- A Wallet is automatically created for a user on sign up, this holds the user's assets
- A user must first set an account pin to authorize transfers before any transfer can be performed
- A single user account can only have one Wallet
  > This assumption is made primarily for the sake of simplicity. Since account_number is unique, the system can easily be extended to allow for multiple wallets for a single user
- The recipient of a transfer can be identified either by his account number or username
- The system integrates **Paystack** (or a similar service) for receiving payments from users
- The system provides two options from confirming user payments to fund their accounts:

  - A webhook endpoint that connects with the payment integration. It receives data on all payaments made and proceeds with the required account funding action. This allows the frontent (Mobile/Web) the flexibility of choosing how the integration is done.
    >
  - An endpoint which is called from the frontend on a successful payment. This endpoint receives the _payment reference_ together with the user _account number_
    > Note: For the case of using a webhook, user Meta data has to be sent along with received payload, to help identify the user account for which the payment was made

- Money transfer between users is done at the virtual account level. Which means,
  - a user can only credit another user's wallet account
  - a user cannot send funds directly to another user's bank account

## **Implementation Details**

The major features of the app,

- Accounts
- Deposits
- Transfers
- Withdrawals, and
- Transactions

### **Account Feature:**

The account feature, which we might also refer to as the virtual wallet of the system allow users to hold digital assets, which can be transfered to other users of the system or exchanged for value (in the form of services).

### **Deposit Feature:**

The deposit feature is how users are able to fund their account (wallet) with digital assets (the `money` or `value` of the system). This feature handles the integration with payment providers (like Paystack) to convert users assets in manetary value to the form used within our system.

### **Transfer Feature:**

With this feature a user of the system can send digital assets (funds) held in his/her account (or wallet) to another user of the system.

In order to guarantee data validity (of the user account balance), the funds transfer operation are done within database transactions, having ACID properties.

### **Withdrawal Feature:**

With the withdrawal feature, users can convert assets stored in their account (wallet) into the form inwhich it was transfered from. This feature also makes use of the payment integration which was initially used in funding the user's wallet.

> **Note**: In this project, the `deposit`, `transfers` and `withdrawal` features have been combined into the **account** module, inside of the src folder. This approach is taken for the sake of simplicity. An alternative is splitting them into seperate modules to accomodate complexity in each module.

### **Transaction Feature:**

Transactions here refer to a record of all events that results in the increment or decrement of a user's account balance.

The transaction types available in the system are:

1. CREDIT
   - Fund Account
   - Bonus
   - Receive from other User
2. DEBIT
   - Withdrawal
   - Expense
   - Transfer to Other User
3. OTHER
   - REFUND

These put together gives us the following transaction types:

> - CREDIT_FUND, CREDIT_BONUS, CREDIT_RECIEVE,
> - DEBIT_WITHDRAW, DEBIT_EXPENSE, DEBIT_TRANSFER
> - OTHER

## **Database Models**

This section describes the various tables inwhich data is stored and the relationship between them. Below an image showing the tables.
![Database Schema](https://res.cloudinary.com/class-attend/image/upload/v1660737296/class-attend/db_schema_diagram_m5w65w.png)

> Note that the diagram does not explicitly specify the relationship that exists between the tables

### **Users Table**

The users table as shown in the diagram above holds the base data of each user, as collected during registration. The `id` is authomatically generated and the `password` is encrypted before being stored to the database.

### **Accounts Table**

This table holds information about users fund. It can also be refered to as the Wallet of the user. The balance column holds the Naira (or funding currency) equivalent with which the user funded his or her wallet.

This table has a **one-to-one** relationship with the users table as a single user can only possess a single wallet (as earlier stated in the design assumptions)

### **Transactions Table**

Every Transaction in the system is denoted by an increment or decrement in a user's account balance. Being a financial system, this table functions as a log to keep track of these increments and decrements.

> We can think of a transaction as an 'effect'. Effects being the number of records updated.

This table has a **one-to-many** relationship with the `transfers` table

### **Transfers Model**

The essence of this table is to store all funds transfer that occur between users account.

> Note: A transfer of funds from one user account to another creates two transactions here, as two records are updated.

Hence,

- there is a **one-to-many** relationship from the `transfers` table to the `transfer_transactions` table
- a **one-to-one** relationship from the `transfer_transactions` table to the `transactions` table

This then results in a **one-to-many** relationship from the `transfers` table to the `transactions` table through the `transfer_transactions` table.

### **Deposit_and_withdrawals Table**

This table holds information about all deposits into a user's account (from a bank account) and all withdrawals from users account, out of the system into a bank account. The `bank_data` column holds JSON data received from the payment integration while processing payments into, and transfers out of the system.

This table has a **one-to-one** relationship with the transactions table, as a single deposit or withdrawal has a sigle effect on the system.

## **Data Flow Diagram**

In this section, i will demonstrate how data flows across the system, from users, through server to database and back using the flowchart diagram below.

## **APENDIX**

### **Project Folder Structure**

This section describes the structure of the files/folders which hold the project code.

![Project folder structure](https://res.cloudinary.com/class-attend/image/upload/v1660737309/class-attend/Screenshot_from_2022-08-17_12-42-01_gt7znc.png)
