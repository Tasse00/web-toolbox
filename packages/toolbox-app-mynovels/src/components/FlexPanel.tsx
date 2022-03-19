import { ComponentWithAs, Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

interface Props extends FlexProps {}

// const FlexPanel: React.FC<Props> = ({ children, ...props }) => {
//   return (
//     <Flex
//       gap={4}
//       p={4}
//       borderWidth={1}
//       borderColor="gray.200"
//       // bg="gray.100"
//       borderRadius={6}
//       {...props}
//     >
//       {children}
//     </Flex>
//   );
// };

export default React.forwardRef<HTMLDivElement, Props>(
  ({ children, ...props }, ref) => (
    <Flex
      ref={ref}
      gap={4}
      p={4}
      borderWidth={1}
      borderColor="gray.200"
      borderRadius={6}
      {...props}
    >
      {children}
    </Flex>
  )
);
