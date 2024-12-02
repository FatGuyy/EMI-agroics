import { AmountShape } from '@agoric/ertp';
import { withOrchestration } from '@agoric/orchestration/src/utils/start-helper.js';
import { ChainInfoShape } from '@agoric/orchestration/src/typeGuards.js';
import { InvitationShape } from '@agoric/zoe/src/typeGuards.js';
import * as flows from './orca.flows.js';

/**
* @typedef {{
*   chainDetails: Record<string, CosmosChainInfo>
* }} OrcaTerms
* @param {ZCF<OrcaTerms>} zcf
* @param {OrchestrationPowers & {
*   marshaller: Marshaller;
* }} privateArgs
* @param {Zone} zone
* @param {OrchestrationTools} tools
*/

const SingleAmountRecord = Matcher.and(
  Matcher.recordOf(Matcher.string(), AmountShape, { numPropertiesLimit: 1 }),
  Matcher.not(harden({}))
);

const OrchestrationPowersShape = Matcher.splitRecord({
  localchain: Matcher.remotable('localchain'),
  orchestrationService: Matcher.remotable('orchestrationService'),
  storageNode: Matcher.remotable('storageNode'),
  timerService: Matcher.remotable('timerService'),
  agoricNames: Matcher.remotable('agoricNames')
});

// the meta data of the contract
export const meta = {
  privateArgsShape: Matcher.and(
    OrchestrationPowersShape,
    Matcher.splitRecord({
      marshaller: Matcher.remotable('marshaller'),
    }),
  ),
  customTermsShape: {
    chainDetails: Matcher.recordOf(Matcher.string(), ChainInfoShape),
  },
};
harden(meta);


const contract = async(
  zcf,
  privateArgs,
  zone,
  { orchestrateAll, zoeTools, chainHub },
) => {
    const { chainDetails } = zcf.getTerms();

    // registering chains and connections
    for (const [name, info] of entries(chainDetails)) {
        const { connections = {} } = info;
        console.log('register', name, {
        chainId: info.chainId,
        connections: keys(connections),
        });

        chainHub.registerChain(name, info);
        for (const [chainId, connInfo] of entries(connections)) {
            chainHub.registerConnection(info.chainId, chainId, connInfo);
          }      
    }

    // Fund transfer logic
    const fundTransfer = async(seat, {sourceChain, destnationChain, amount}) => {
    const srcConnection = chainHub.getConnection(sourceChain);
    const destConnection = chainHub.getConnection(destinationChain);

    assert(srcConnection, `Source chain ${sourceChain} is not registered`);
    assert(destConnection, `Destination chain ${destinationChain} is not registered`);

    // Example fund transfer (details depend on chains' APIs)
    console.log(`Transferring ${amount} from ${sourceChain} to ${destinationChain}`);
    const { payout } = await srcConnection.withdraw(amount);
    await destConnection.deposit(payout);

    seat.exit();
    return `Transferred ${amount} from ${sourceChain} to ${destinationChain}`;
  };
}

const { makeAccount, makeCreateAndFund } = orchestrateAll(flows, {localTransfer: zoeTools.localTransfer,});
const publicFacet = zone.exo(
    'Transfer Public Facet',
    Matcher.interface('Transfer PF', {
    makeTransferInvitation: Matcher.callWhen().returns(InvitationShape),
    }),
    {
      makeTransferInvitation() {
          return zcf.makeInvitation(
            seat => {
              const proposal = seat.getProposal();
              const { give } = proposal;
              const sourceChain = proposal.customFields.sourceChain;
              const destinationChain = proposal.customFields.destinationChain;
              return transferFunds(seat, { sourceChain, destinationChain, amount: give.Amount });
            },
            'Transfer Funds Between Chains',
            undefined,
            Matcher.splitRecord({
              give: SingleAmountRecord,
              customFields: Matcher.recordOf(
                'sourceChain',
                Matcher.string(),
                'destinationChain',
                Matcher.string(),
              ),
            }),
          );
        },
      },
    );
    return { publicFacet };
    
export const start = withOrchestration(contract);
harden(start);