import { Flex, Skeleton } from "@chakra-ui/react";
import React from "react";

export const ListSkeleton: React.FC<{}> = (props) => {
  return (
    <Flex direction="column">
      <Skeleton m={2} h={12} />
      <Skeleton m={2} h={12} />
      <Skeleton m={2} h={12} />
    </Flex>
  );
};
