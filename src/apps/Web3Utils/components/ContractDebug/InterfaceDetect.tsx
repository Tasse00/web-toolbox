import { useWeb3State } from "../../hooks/web3";
import useDetectInterface from "../../hooks/web3/useDetectInterface";
import React from "react";
import { AbiItem } from "web3-utils";
import { Alert, Card } from "antd";
import { unique } from "../../utils/array";
import { getAbiKey, getInterfaceId } from "../../utils/web3";
const InterfaceDetect: React.FC<{
  abi: AbiItem[];
  name: string;
  address: string;
}> = ({ address, abi, name }) => {
  const funcAbi = React.useMemo(
    () =>
      unique([...abi.filter((item) => item.type === "function")], getAbiKey),
    [abi]
  );
  const { getWeb3 } = useWeb3State();

  const interfaceId = React.useMemo(
    () => getInterfaceId(funcAbi, getWeb3()),
    [funcAbi, getWeb3]
  );

  const { loading, data, error } = useDetectInterface(address, interfaceId);

  return (
    <Card loading={loading} title={name} size="small">
      {data && (
        <>
          <div>support ERC165? {data.supportedERC165 ? "Yes" : "No"}</div>
          <div>
            support {name}? {data.supported ? "Yes" : "No"}
          </div>
        </>
      )}
      {error && <Alert type="error">{error.message}</Alert>}
    </Card>
  );
};

export default InterfaceDetect;
