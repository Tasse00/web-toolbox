import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import BN from 'bn.js';

export function isValidPrivateKey(pk: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(pk);
}
export function isValidNodeUrl(url: string): boolean {
  return /^(http|https|ws|wss):\/\/[a-zA-Z0-9.:/]+$/.test(url);
}
export function isValidAddress(addr: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

export function getAbiKey(abi: AbiItem): string {
  return (
    abi.name + (abi.inputs || []).map((i) => `${i.name}|${i.type}`).join(';')
  );
}

export function formatAbi(abi: AbiItem, withReturn?: boolean): string {
  const args = (abi.inputs || [])
    .map((ipt) => `${ipt.type} ${ipt.name}`)
    .join(', ');
  if (withReturn) {
    const outputs = (abi.outputs || []).map((opt) => opt.type).join(',');
    return `${abi.name}(${args}) -> (${outputs})`;
  } else {
    return `${abi.name}(${args})`;
  }
}

export function getInterfaceId(abi: AbiItem[], web3: Web3): string {
  const methods = abi.filter(item=>item.type==='function')
    .map(item=>`${item.name}(${(item.inputs||[]).map(ipt=>ipt.type).join(",")})`);

  const methodsSig = methods.map((method) => {
    const sig = web3.utils.keccak256(method);
    return new BN(sig.slice(2), 'hex');
  });


  if (methodsSig.length === 0) {
    return '0x00000000';
  }
  let base = methodsSig[0];

  for (let sig of methodsSig.slice(1)) {
    base = base.xor(sig);
  }

  return '0x' + base.toString('hex', 64).slice(0, 8);
}
