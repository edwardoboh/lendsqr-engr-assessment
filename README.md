![Lendsqr Logo](http://www.orb-digital.com/images/icons/logo-pills/lendsqr.svg)

# **Backend Engineer Assessment**

This documnets provides information about my implementation of the Lendsqr Engineering Assessment
which requires that i build a product that allows its users the ability to:

- create an account
- fund their account
- transfer funds to another user’s account
- withdraw funds from their account.

The document is divided into several sections, listed below

## **High Level System Design**

The diagram below shows the various components of the system as can be infered from its requirements.

![high level diagram](https://drive.google.com/uc?export=download&id=1KPAnEGiRBBq0teTs7cTgUAjxucKj27ot)

The API services users request from both mobile and web platforms.The diagram above is a simplified representation of the system.
In reality, several components exist between those shown. For example,

There exists a DNS server that routes user request to our system, a Load Balancer (which might also function as a reverse proxy) could be placed between the user and the web server. Several caching layers could also exist in the system, to avoid overloading and enable quick delivery of data.

The database system used here is MySQL. For my implementation of this system, this database runs inside of a Docker Container and the Docker Compose file can be found in the root of the project folder.

## **Database Models**

This section describes the various tables inwhich data is stored and the relationship between them. Below an image showing the tables.
![Database Schema](https://drive.google.com/uc?export=download&id=10TNeeZ9QkL5yzRQ2k3hhvTyD-FjUdbW7)

> Note that the diagram does not explicitly specify the relationship that exists between the tables

## **Implementation Details**

### Assumptions made

- A Wallet is automatically created for a user on sign up, this holds the user's assets
- A user must first set an account pin to authorize transfers before any transfer can be performed
- A single user account can only have one Wallet
  > This assumption is made primarily for the sake of simplicity. Since account_number is unique, the system can easily be extended to allow for multiple wallets for a single user
- The recipient of a transfer can be identified either by his account number or username
- Meta data is sent along with every payment to help identify the user account for which the pay,ent was made
- A webhook endpoint exists to verify all Wallet funding transactions from a payment references received from the payment integration. This allows the frontent (Mobile/Web) the flexibility of choosing how the integration is done

- Money transfer between users is done at the virtual account level. Which means,
  - a user can only credit another user's wallet account
  - a user cannot send funds directly to another user's bank account

## **Data Flow Diagram**

In this section, i will demonstrate how data flows across the system, from users, through server to database and back using the flowchart diagram below.

## **API Endpoints**

In this section, i describe the various API endpoints

## **Project Folder Structure**

This section describes the structure of the files/folders which hold the project code.

### Other Notes:

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
