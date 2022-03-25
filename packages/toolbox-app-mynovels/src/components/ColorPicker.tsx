import {
  Box,
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

export const ColorPicker: React.FC<{
  value: string;
  onChange: (v: string) => any;
  options?: string[];
}> = ({ value, onChange, options = DefaultColors }) => {
  const [vis, setVis] = useBoolean(false);

  return (
    <>
      <Box
        w={16}
        h={8}
        borderRadius="lg"
        bg={value}
        borderWidth={1}
        borderColor="gray.200"
        onClick={setVis.on}
      />

      <Modal isCentered isOpen={vis} onClose={setVis.off}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody maxH={80} overflow="auto">
            <Flex gap={1} wrap="wrap" justify="space-around">
              {options.map((c) => (
                <Box
                  key={c}
                  w={16}
                  h={8}
                  borderRadius="lg"
                  bg={c}
                  onClick={() => {
                    onChange(c);
                    setVis.off();
                  }}
                />
              ))}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* <Drawer isOpen={vis} placement="bottom" onClose={setVis.off}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody maxH={80} overflow="auto">
            <Flex gap={1} wrap="wrap">
              {options.map((c) => (
                <Box
                  w={16}
                  h={8}
                  bg={c}
                  onClick={() => {
                    onChange(c);
                    setVis.off();
                  }}
                />
              ))}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer> */}
    </>
  );
};

export const DefaultColors = [
  "aliceblue",
  "antiquewhite",
  "aqua",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blanchedalmond",
  "blue",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgray",
  "darkgreen",
  "darkgrey",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkslategrey",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
  "dimgray",
  "dimgrey",
  "dodgerblue",
  "firebrick",
  "floralwhite",
  "forestgreen",
  "fuchsia",
  "gainsboro",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "green",
  "greenyellow",
  "grey",
  "honeydew",
  "hotpink",
  "indianred",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavenderblush",
  "lawngreen",
  "lemonchiffon",
  "lightblue",
  "lightcoral",
  "lightcyan",
  "lightgoldenrodyellow",
  "lightgray",
  "lightgreen",
  "lightgrey",
  "lightpink",
  "lightsalmon",
  "lightseagreen",
  "lightskyblue",
  "lightslategray",
  "lightslategrey",
  "lightsteelblue",
  "lightyellow",
  "lime",
  "limegreen",
  "linen",
  "magenta",
  "maroon",
  "mediumaquamarine",
  "mediumblue",
  "mediumorchid",
  "mediumpurple",
  "mediumseagreen",
  "mediumslateblue",
  "mediumspringgreen",
  "mediumturquoise",
  "mediumvioletred",
  "midnightblue",
  "mintcream",
  "mistyrose",
  "moccasin",
  "navajowhite",
  "navy",
  "oldlace",
  "olive",
  "olivedrab",
  "orange",
  "orangered",
  "orchid",
  "palegoldenrod",
  "palegreen",
  "paleturquoise",
  "palevioletred",
  "papayawhip",
  "peachpuff",
  "peru",
  "pink",
  "plum",
  "powderblue",
  "purple",
  "rebeccapurple",
  "red",
  "rosybrown",
  "royalblue",
  "saddlebrown",
  "salmon",
  "sandybrown",
  "seagreen",
  "seashell",
  "sienna",
  "silver",
  "skyblue",
  "slateblue",
  "slategray",
  "slategrey",
  "snow",
  "springgreen",
  "steelblue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "transparent",
  "turquoise",
  "violet",
  "wheat",
  "white",
  "whitesmoke",
  "yellow",
  "yellowgreen",
];
