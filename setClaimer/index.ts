
import { ethers } from 'ethers';
import Safe, { EthersAdapter, Web3Adapter, SafeFactory, SafeTransactionOptionalProps } from '@gnosis.pm/safe-core-sdk';
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import dotenv from 'dotenv';
import { SafeTransactionDataPartial } from '@gnosis.pm/safe-core-sdk-types';
import { listofAddresses, listofAddresses2 } from './addressList';

const transactionServiceUrl = 'https://safe-transaction.xdai.gnosis.io'
const safeService = new SafeServiceClient(transactionServiceUrl)

dotenv.config()

async function yeet(transactions:SafeTransactionDataPartial[], injectedNonce?:number) {

    const  safeAddress = '0x6626528DE0c75Ccc7A0d24F2D24b99060f74EdEe'
    const  senderAddress = '0xdec0DED0606B7d0560ADEBD6C3a919a671dB4D66'

    const provider = new ethers.providers.JsonRpcProvider('https://rpc.xdaichain.com')
    const signer = new ethers.Wallet('', provider);

    const ethAdapter= new EthersAdapter({
        ethers,
        signer: signer
      })

    const chainId = await ethAdapter.getChainId();

    
    const safeFactory = await SafeFactory.create({ ethAdapter })
    const safeSdk: Safe = await Safe.create({ ethAdapter: ethAdapter, safeAddress: safeAddress })

    console.log(safeSdk.getAddress())
    const options: SafeTransactionOptionalProps = {
        nonce:injectedNonce // Optional
      }
      
    const safeTransaction = await safeSdk.createTransaction(transactions, options)
    
    await safeSdk.signTransaction(safeTransaction)
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
    await safeService.proposeTransaction({
        safeAddress,
        safeTransaction,
        safeTxHash,
        senderAddress
    })
}

function setClaimer( ){
    let transactions = []

    for (let i = 0; i < listofAddresses.length; i++) {
        transactions.push(
            {
                to: '0xfa255f5104f129B78f477e9a6D050a02f31A5D86',
                data: `0xf5cf673b000000000000000000000000${listofAddresses[i]}0000000000000000000000006626528de0c75ccc7a0d24f2d24b99060f74edee`,
                value: '0'
            },
        )

    }
    yeet(transactions, undefined)
}

function claimRewardsOnBehalf(){
     
    let transactions = []
    for (let i = 0; i < listofAddresses2.length; i++) {
        transactions.push(
            {
                to: '0xfa255f5104f129B78f477e9a6D050a02f31A5D86',
                data: `0x6d34b96e0000000000000000000000000000000000000000000000000000000000000080ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000${listofAddresses2[i]}0000000000000000000000006626528de0c75ccc7a0d24f2d24b99060f74edee000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000002ecd3e49c65b30cf6353b928a1d18df5951aaa3e00000000000000000000000034b8d5bb7ed171ab5cef266030b8181304344c5100000000000000000000000095a21fcbb57ed54d3a5a706068b06cee8637998a0000000000000000000000008be80b0b794a45d4832784c9b63352eaff2096bb0000000000000000000000003b8f9bb5ad6e699943c7e0089fbc0735b2a4f18e000000000000000000000000a9ddaa3f02188977329f676f7ae2e00463a026aa000000000000000000000000b5a165d9177555418796638447396377edf4c18a0000000000000000000000005901102402a4c25c10308e8c7aadd780fd94bf42000000000000000000000000f7a28097fdf8c323da826a9d98617a266a73c0ef000000000000000000000000fe31f6ff4366d2e17904e474605c2c6c42323380`,
                value: '0'
            },
        )

    }
    yeet(transactions, 41)
}

function setClaimerAndClaimRewards(){
    let transactions = []
    for (let i = 0; i < listofAddresses2.length; i++) {
        transactions.push(
            {
                to: '0xfa255f5104f129B78f477e9a6D050a02f31A5D86',
                data: `0xf5cf673b000000000000000000000000${listofAddresses2[i]}0000000000000000000000006626528de0c75ccc7a0d24f2d24b99060f74edee`,
                value: '0'
            },
        )
        transactions.push(
            {
                to: '0xfa255f5104f129B78f477e9a6D050a02f31A5D86',
                data: `0x6d34b96e0000000000000000000000000000000000000000000000000000000000000080ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff000000000000000000000000${listofAddresses2[i]}0000000000000000000000006626528de0c75ccc7a0d24f2d24b99060f74edee000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000002ecd3e49c65b30cf6353b928a1d18df5951aaa3e00000000000000000000000034b8d5bb7ed171ab5cef266030b8181304344c5100000000000000000000000095a21fcbb57ed54d3a5a706068b06cee8637998a0000000000000000000000008be80b0b794a45d4832784c9b63352eaff2096bb0000000000000000000000003b8f9bb5ad6e699943c7e0089fbc0735b2a4f18e000000000000000000000000a9ddaa3f02188977329f676f7ae2e00463a026aa000000000000000000000000b5a165d9177555418796638447396377edf4c18a0000000000000000000000005901102402a4c25c10308e8c7aadd780fd94bf42000000000000000000000000f7a28097fdf8c323da826a9d98617a266a73c0ef000000000000000000000000fe31f6ff4366d2e17904e474605c2c6c42323380`,
                value: '0'
            },
        )

    }
    yeet(transactions, 40)

}


setClaimerAndClaimRewards()