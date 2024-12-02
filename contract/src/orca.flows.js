/**
 * @param {Orchestrator} orch
 * @param {object} ctx
 * @param {ZoeTools['localTransfer']} ctx.localTransfer
 * @param {ZCFSeat} seat
 * @param {{sourceChain: string, destinationChain: string, denom: DenomArg}} offerArgs
*/


export const makeFundTransfer = async (
 orch,
 { localTransfer },
 seat,
 { sourceChain, destinationChain, denom },
) => {
 console.log(
   `Starting fund transfer from ${sourceChain} to ${destinationChain} for denom ${denom}`,
 );

 const { give } = seat.getProposal();
console.log('Given amount:', give);
const [[_kw, amt]] = Object.entries(give);

// get chain information
const [source, destination] = await Promise.all([
  orch.getChain(sourceChain),
  orch.getChain(destinationChain),
]);
console.log(`Fetched details for ${sourceChain} and ${destinationChain}`);
const sourceInfo = await source.getChainInfo();
const destinationInfo = await destination.getChainInfo();
console.log('Source chain info:', sourceInfo);
console.log('Destination chain info:', destinationInfo);

// creating accounts
const [sourceAccount, destinationAccount] = await Promise.all([
  source.makeAccount(),
  destination.makeAccount(),
]);
const [sourceAddress, destinationAddress] = await Promise.all([
  sourceAccount.getAddress(),
  destinationAccount.getAddress(),
]);

console.log(`Transferring ${amt.value} ${denom} to ${sourceChain}`);
await localTransfer(seat, sourceAccount, give);
console.log(
  `Initiating cross-chain transfer of ${amt.value - amt.value/2} ${denom} to ${destinationChain}`,
);
await sourceAccount.transfer(
  {
    denom,
    value: amt.value - amt.value/2,
  },
  destinationAddress,
);

const destinationBalance = await destinationAccount.getBalance(denom);
console.log('Destination chain balance after transfer:', destinationBalance);

seat.exit();

return destinationAccount.asContinuingOffer();
};

harden(makeFundTransfer);
