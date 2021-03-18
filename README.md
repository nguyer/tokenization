# Simple Tokenization Server

This project is a really simple tokenization server

> **NOTE**: This project is **not** production ready. Please don't use it to store sensitive data.

## Prerequisites
You'll need to have [Node.js](https://nodejs.org/en/download/) installed and available on your path to run the server

## Clone the repo
```bash
$ git clone https://github.com/nguyer/tokenization
$ cd tokenization
```

### Install dependencies
```bash
$ npm install
```

### Compile and run the server
```bash
$ npm start
```

## Points of consideration
While this server demonstrates the absolute bare minimum functionality of a tokenization server, there are numerous areas that would need to be hardened to make this a viable production service.

### Key security
This is the most obvious one. If someone gains access to the key, they gain access to all the secrets. Obviously the key should not be stored in plaintext on the local filesystem like it is currently. There are several ways this could be improved, ordered from slightly more secure to significantly more secure:

 - Read the key from an environment variable
   - This would prevent other applications not running in the same shell from accessing the key
 - Retrieve the key from a secure Key Management System (KMS) using the execution role the machine the server is running on to authenticate to the KMS
   - This keeps the key only in memory on the machine the tokenization server is running on. Other applications would not have access to it, even if they can read the environment variables of the tokenization server
   - This also keeps the key out of devops scripts, or other "human readable" areas that are commonly needed to deploy software
   - This also prevents unauthorized access to the key from other machines running within the same network, unless they have a policy associated with them that specifically allows that machine to retrieve the key
 - The most secure solution (though less user friendly) is to not store a key at all. The end user keeps their own key and provides it with their request to decrypt data. The key is only kept in memory during the duration of the decryption process.
    - This prevents unauthorized access to the secrets because we do not have a key anywhere that can be used to decrypt the data, unless the end user specifically asks us to do so.
    - The only way to compromise the key in this scenario would be to intercept the network request (there are ways to mitigate against this that are also discussed below), or possibly directly read memory on the server

### Segmentation
This is about security, but also privacy. If this system is going to be multi-tenant, the data needs to be segmented so that one tenant cannot access another tenant's data. Separate keys should be used for each tenant, making it impossible for one to decrypt another's data.

### HTTPS
This server should definitely use HTTPS, but it does not right now. Even if behind a load balancer, it is recommended to terminate TLS at the application itself so that nothing except the application can read requests in-transit.

### Data storage
The current server is implemented with an in-memory database. The rest of the code uses a common interface to talk to the data layer, so this class could easily be swapped out for a distributed, secure database. The current implementation is fine for a demonstration but has several significant limitations.
 - Persistance
   - If you restart the server, the data is gone. This won't work in a production environment.
 - Scalability
   - The server is stateless so it could scale very well. However the data layer is not scalable. The current map data structure is not designed to hold millions of records.
 - Security
   - The content of this database is obviously highly sensitive and should be secured very well. General suggestions for this include:
     - Encrypt all data at rest
     - Enable tight access controls for which people/processes are allowed to access the data
     - Enable access control logging to audit data access