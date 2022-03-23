import { Box } from "@chakra-ui/react";
import React from "react";
import { AppRuntime } from "../Framework";

interface Props {
  runtime: AppRuntime<any>;
}

const AppBox: React.FC<Props> = ({ runtime }) => {
  const Com = runtime.config.component;
  const props = runtime.props;
  return (
    <Box w="full" h="full">
      <Com {...props} />
    </Box>
  );
};

export default AppBox;
