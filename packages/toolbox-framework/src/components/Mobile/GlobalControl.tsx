import {
  Box,
  Button,
  Flex,
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
  Spacer,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  AddIcon,
  ExternalLinkIcon,
  RepeatIcon,
  EditIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import React, { useContext, useEffect, useMemo, useState } from "react";

import { useFocus } from "../../hooks/useFocus";
import { FrameworkContext } from "../Framework";

interface Props {}

const GlobalControl: React.FC<Props> = (props) => {
  const [menuVis, setMenuVis] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const {
    apps,
    configs,
    launchApp,
    terminateApp,
    resizeApp,
    moveApp,
    setAppInsTitle,
    setAppOpen,
    focusApp,
    size,
  } = useContext(FrameworkContext);

  const currentApp = useMemo(() => {
    let app = null;
    for (const a of apps) {
      if (app === null) {
        app = a;
      } else if (app.order <= a.order) {
        app = a;
      }
    }
    return app;
  }, [apps]);

  useEffect(() => {
    if (expanded) {
      const collapse = () => {
        setExpanded(false);
      };
      document.addEventListener("click", collapse);
      return () => document.removeEventListener("click", collapse);
    }
  }, [expanded]);

  return (
    <>
      <Flex
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setExpanded(true);
          return false;
        }}
        position="fixed"
        bg="gray.100"
        bottom="20%"
        left={expanded ? 0 : -14}
        // width={20}
        // height={8}
        transitionProperty="left"
        transitionDuration="0.2s"
        justify="right"
        align="center"
        p={2}
        borderTopRightRadius="xl"
        borderBottomRightRadius="xl"
      >
        <Button
          colorScheme="blue"
          size="xs"
          mr={2}
          variant="outline"
          onClick={() => {
            if (currentApp) {
              setAppOpen({ insId: currentApp.insId, open: false });
            }
          }}
        >
          Dash
        </Button>
        <ArrowRightIcon color="gray.500" />
      </Flex>

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
