import ERC20 from './ERC20.json';
import IERC721 from './IERC721.json';
import IERC721Enumerable from './IERC721Enumerable.json';
import IAccessControl from './IAccessControl.json';

import { AbiItem } from 'web3-utils';
// @ts-ignore
const ABIs = {
  IERC721: IERC721 as AbiItem[],
  IERC721Enumerable: IERC721Enumerable as AbiItem[],
  ERC20: ERC20 as AbiItem[],
  IAccessControl: IAccessControl as AbiItem[],
};

export default ABIs;
