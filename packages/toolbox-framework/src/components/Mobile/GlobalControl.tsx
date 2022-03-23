import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  AddIcon,
  ExternalLinkIcon,
  RepeatIcon,
  EditIcon,
} from "@chakra-ui/icons";
import React, { useState } from "react";

import { useFocus } from "../../hooks/useFocus";
import { Fade } from "@chakra-ui/react";

interface Props {}

const GlobalControl: React.FC<Props> = (props) => {
  const [menuVis, setMenuVis] = useState(false);
  const [ref, focused] = useFocus<HTMLDivElement>();
  console.log(focused);
  return (
    <>
      <Box
        position="fixed"
        left={focused ? 0 : -1}
        bg="gray.200"
        bottom="20%"
        transitionProperty="left"
        transitionDuration="0.2s"
      >
        <Fade in={focused} ref={ref}>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
            />
            <MenuList>
              <MenuItem icon={<AddIcon />} command="⌘T">
                New Tab
              </MenuItem>
              <MenuItem icon={<ExternalLinkIcon />} command="⌘N">
                New Window
              </MenuItem>
              <MenuItem icon={<RepeatIcon />} command="⌘⇧N">
                Open Closed Tab
              </MenuItem>
              <MenuItem icon={<EditIcon />} command="⌘O">
                Open File...
              </MenuItem>
            </MenuList>
          </Menu>
        </Fade>
      </Box>

      <Modal isCentered isOpen={menuVis} onClose={() => setMenuVis(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <Box>Menu</Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GlobalControl;
