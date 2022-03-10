import React from "react";
import { FrameGroupContext } from "../components/Frame/FrameGroup";
import { FrameContext } from "../components/Frame/Frame";

export function useFrameGroup() {
  return React.useContext(FrameGroupContext);
}

export function useFrame() {
  return React.useContext(FrameContext);
}
