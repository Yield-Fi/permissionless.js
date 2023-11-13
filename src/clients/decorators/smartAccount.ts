import type {
    Abi,
    Chain,
    Client,
    SendTransactionParameters,
    Transport,
    TypedData,
    WriteContractParameters
} from "viem"
import type { SmartAccount } from "../../accounts/types.js"
import { deployContract } from "../../actions/smartAccount/deployContract.js"
import { getChainId } from "../../actions/smartAccount/getChainId.js"
import { type SponsorUserOperationMiddleware } from "../../actions/smartAccount/prepareUserOperationRequest.js"
import {
    type SendTransactionWithPaymasterParameters,
    sendTransaction
} from "../../actions/smartAccount/sendTransaction.js"
import { signMessage } from "../../actions/smartAccount/signMessage.js"
import { signTypedData } from "../../actions/smartAccount/signTypedData.js"
import {
    type WriteContractWithPaymasterParameters,
    writeContract
} from "../../actions/smartAccount/writeContract.js"

export type SmartAccountActions<
    TChain extends Chain | undefined = Chain | undefined,
    TSmartAccount extends SmartAccount | undefined = SmartAccount | undefined
> = {
    getChainId: () => ReturnType<typeof getChainId>
    sendTransaction: <TChainOverride extends Chain | undefined>(
        args: SendTransactionParameters<TChain, TSmartAccount, TChainOverride>
    ) => ReturnType<
        typeof sendTransaction<TChain, TSmartAccount, TChainOverride>
    >
    signMessage: (
        args: Parameters<typeof signMessage<TChain, TSmartAccount>>[1]
    ) => ReturnType<typeof signMessage<TChain, TSmartAccount>>
    signTypedData: <
        const TTypedData extends TypedData | { [key: string]: unknown },
        TPrimaryType extends string
    >(
        args: Parameters<
            typeof signTypedData<
                TTypedData,
                TPrimaryType,
                TChain,
                TSmartAccount
            >
        >[1]
    ) => ReturnType<
        typeof signTypedData<TTypedData, TPrimaryType, TChain, TSmartAccount>
    >
    deployContract: <
        const TAbi extends Abi | readonly unknown[],
        TChainOverride extends Chain | undefined = undefined
    >(
        args: Parameters<
            typeof deployContract<TAbi, TChain, TSmartAccount, TChainOverride>
        >[1]
    ) => ReturnType<
        typeof deployContract<TAbi, TChain, TSmartAccount, TChainOverride>
    >
    writeContract: <
        const TAbi extends Abi | readonly unknown[],
        TFunctionName extends string,
        TChainOverride extends Chain | undefined = undefined
    >(
        args: WriteContractParameters<
            TAbi,
            TFunctionName,
            TChain,
            TSmartAccount,
            TChainOverride
        >
    ) => ReturnType<
        typeof writeContract<
            TChain,
            TSmartAccount,
            TAbi,
            TFunctionName,
            TChainOverride
        >
    >
}

export const smartAccountActions =
    ({ sponsorUserOperation }: SponsorUserOperationMiddleware) =>
    <
        TTransport extends Transport,
        TChain extends Chain | undefined = Chain | undefined,
        TSmartAccount extends SmartAccount | undefined =
            | SmartAccount
            | undefined
    >(
        client: Client<TTransport, TChain, TSmartAccount>
    ): SmartAccountActions<TChain, TSmartAccount> => ({
        deployContract: (args) => deployContract(client, args),
        getChainId: () => getChainId(client),
        sendTransaction: (args) =>
            sendTransaction(client, {
                ...args,
                sponsorUserOperation
            } as SendTransactionWithPaymasterParameters),
        signMessage: (args) => signMessage(client, args),
        signTypedData: (args) => signTypedData(client, args),
        writeContract: (args) =>
            writeContract(client, {
                ...args,
                sponsorUserOperation
            } as WriteContractWithPaymasterParameters)
    })
