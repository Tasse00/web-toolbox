import {
  Box,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useBoolean,
} from "@chakra-ui/react";
import React from "react";

export const FontSizePicker: React.FC<{
  value: string;
  onChange: (v: string) => any;
  options?: string[];
}> = ({ value, onChange, options = DefaultSizes }) => {
  const [vis, setVis] = useBoolean(false);

  return (
    <>
      <Center
        w={12}
        h={12}
        borderRadius="lg"
        borderColor="gray.200"
        borderWidth={1}
        onClick={setVis.on}
        fontSize={value}
      >
        {value}
      </Center>

      <Modal isCentered isOpen={vis} onClose={setVis.off}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody maxH={80} overflow="auto">
            <Flex gap={1} wrap="wrap" justifyContent="space-around">
              {options.map((item) => (
                <Center
                  key={item}
                  w={12}
                  h={12}
                  borderRadius="lg"
                  borderColor="gray.200"
                  borderWidth={1}
                  onClick={() => {
                    onChange(item);
                    setVis.off();
                  }}
                  fontSize={item}
                >
                  {item}
                </Center>
              ))}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export const DefaultSizes = ["sm", "md", "lg", "xl", "2xl"];
