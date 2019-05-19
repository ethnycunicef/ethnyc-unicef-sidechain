const {createContext, CryptoFactory} = require('sawtooth-sdk/signing');
const {Secp256k1PrivateKey, Secp256k1PublicKey} = require('sawtooth-sdk/signing/secp256k1');
const {createHash} = require('crypto');
const {protobuf} = require('sawtooth-sdk');
const colors = require('colors');
const rpc = require('./proto/rpc_methods_pb');
const context = createContext('secp256k1');
const opn = require('opn');
const axios = require('axios');
const prettyjson = require('prettyjson');
const moment = require('moment');
const school_pb = require('./proto/school_pb');


// hard coded example private key
const pk = Buffer.from("e3ddee618d8a8864481e71021e42ed46c3ab410ab1ad7cdf0ff31f6d61739275", 'hex');
const priv = new Secp256k1PrivateKey(pk);
const signer = new CryptoFactory(context).newSigner(priv);

const CONFIG = {
    templates: {
        familyName: "unicef",
        familyVersion: "1.0",
        namespaces: {
            schoolAddress(p, m, post) {
                const prefix = createHash('sha512').update("unicef:schools").digest('hex').substring(0, 6);
                const o = createHash('sha512').update(p).digest('hex').substring(0, 25);
                const n = createHash('sha512').update(m).digest('hex').substring(0, 25);

                const v = createHash('sha512').update(post).digest('hex').toLowerCase().substring(0, 14);
                return `${prefix}${o}${n}${v}`
            },
        }
    }
};

const create = async (school) => {
    const rpcReq = createRPCRequest(school);
    const reqBytes = rpcReq.serializeBinary();

    //compute state address
    const stateAddresses = [
        CONFIG.templates.namespaces.schoolAddress(school.getIspId(), school.getId0(), school.getSchoolId()),
        CONFIG.templates.namespaces.schoolAddress(school.getIspId(), school.getId1(), school.getSchoolId()),
        CONFIG.templates.namespaces.schoolAddress(school.getIspId(), school.getId2(), school.getSchoolId()),
        CONFIG.templates.namespaces.schoolAddress(school.getIspId(), school.getId3(), school.getSchoolId()),
        CONFIG.templates.namespaces.schoolAddress(school.getIspId(), school.getId4(), school.getSchoolId()),
    ]

    // // do the sawtooth thang ;)
    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
        familyName: CONFIG.templates.familyName,
        familyVersion: CONFIG.templates.familyVersion,
        inputs: stateAddresses,
        outputs: stateAddresses,
        signerPublicKey: signer.getPublicKey().asHex(),
        // In this example, we're signing the batch with the same private key,
        // but the batch can be signed by another party, in which case, the
        // public key will need to be associated with that key.
        batcherPublicKey: signer.getPublicKey().asHex(),
        // In this example, there are no dependencies.  This list should include
        // an previous transaction header signatures that must be applied for
        // this transaction to successfully commit.
        // For example,
        // dependencies: ['540a6803971d1880ec73a96cb97815a95d374cbad5d865925e5aa0432fcf1931539afe10310c122c5eaae15df61236079abbf4f258889359c4d175516934484a'],
        dependencies: [],
        payloadSha512: createHash('sha512').update(reqBytes).digest('hex')
    }).finish();

    console.log(colors.yellow(`state addresses: ${stateAddresses}`));
    return await submitTransaction(transactionHeaderBytes, reqBytes);
};

const createRPCRequest = (school) => {
    const create = new rpc.Create_School();
    create.setParams(school);
    const payload = new rpc.RPCRequest();
    payload.setCreateSchool(create);
    return payload;
};

const submitTransaction = async (transactionHeaderBytes, axioscRequestBytes) => {
    try {
        const signature = signer.sign(transactionHeaderBytes);

        const transaction = protobuf.Transaction.create({
            header: transactionHeaderBytes,
            headerSignature: signature,
            payload: axioscRequestBytes
        });

        const transactions = [transaction];

        const batchHeaderBytes = protobuf.BatchHeader.encode({
            signerPublicKey: signer.getPublicKey().asHex(),
            transactionIds: transactions.map((txn) => txn.headerSignature),
        }).finish();

        const signature1 = signer.sign(batchHeaderBytes);

        const batch = protobuf.Batch.create({
            header: batchHeaderBytes,
            headerSignature: signature1,
            transactions: transactions
        });

        const batchListBytes = protobuf.BatchList.encode({
            batches: [batch]
        }).finish();

        const reqConfig = {
            method: 'POST',
            url: 'http://127.0.0.1:8008/batches',
            data: batchListBytes,
            headers: {'Content-Type': 'application/octet-stream'}
        };

        const response = await  axios(reqConfig);

        const link = response.data.link;
        console.log(colors.green(`transaction submitted successfully`));
        console.log(colors.green(`status: ${link}`));
        opn(link);
        process.exit(0);
    } catch (e) {
        throw e;
    }
};

const queryState = async (address) => {
    try {
        const reqConfig = {
            method: 'GET',
            url: `http://127.0.0.1:8008/state?address=${address}`,
            headers: {'Content-Type': 'application/json'}
        };

        const response = await  axios(reqConfig);
        const data = response.data.data;
        data.forEach(entry => {
            const data = Buffer.from(entry.data, 'base64');
            const school_proto = school_pb.School.deserializeBinary(data);
            const school = school_proto.toObject();
            const output = {
                'state-address': entry.address,
                'school-info': school,
            };

            console.log(prettyjson.render(output));
        });

        process.exit(0);
    } catch (e) {
        throw e;
    }
};

module.exports = {
    create,
    queryState
};
