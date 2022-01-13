import React from "react";
import { usePersistent } from "../../common/providers/persistent/context";
import { LocalPersistentProvider } from "../../common/providers/persistent/LocalPersistentProvider";

const ShowKey: React.FC<{ kp: string }> = ({ kp }) => {
  const { loading, value: _value } = usePersistent(kp);
  const value = _value || "NOKEY:" + kp;
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{ background: "rgba(200,200,200,0.3)", padding: 4, margin: 4 }}
      >
        {kp}
      </div>
      <div>{loading ? "..." : JSON.stringify(value)}</div>
    </div>
  );
};

const SetKey: React.FC<{ kp: string; value: any }> = ({ kp, value }) => {
  const { update } = usePersistent(kp);
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{ background: "rgba(200,200,200,0.3)", padding: 4, margin: 4 }}
      >
        {kp}
      </div>
      <button onClick={() => update(value)}>Set {JSON.stringify(value)}</button>
    </div>
  );
};

const TestApp: React.FC<{}> = (props) => {
  return (
    <LocalPersistentProvider key="__test_persistent" mockDelay={300}>
      <div style={{ width: "100%", height: "100%" }}>
        <ShowKey kp="" />
        <SetKey kp="" value={{}} />
        <ShowKey kp="person" />
        <SetKey kp="person" value={{ name: "--", mobiles: [] }} />
        <ShowKey kp="person.name" />
        <SetKey kp="person.name" value={"BEN"} />
        <ShowKey kp="person.mobiles.0" />
        <SetKey kp="person.mobiles.0" value={"17721343006"} />
        <ShowKey kp="address" />
        <SetKey kp="address" value={{ street: "No.1" }} />
        <ShowKey kp="address.street" />
        <SetKey kp="address.street" value={"No.2"} />
      </div>
    </LocalPersistentProvider>
  );
};

export default TestApp;
