import React from "react";
import { Flex, FlexProps, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useI18n } from "toolbox-framework";

export const ChapterControl = React.forwardRef<
  HTMLDivElement,
  FlexProps & {
    prevDisabled?: boolean;
    nextDisabled?: boolean;
    onPrev?: () => any;
    onNext?: () => any;
  }
>(
  (
    { onNext, onPrev, prevDisabled = false, nextDisabled = false, ...props },
    ref
  ) => {
    const [t] = useI18n();
    return (
      <Flex ref={ref} columnGap={2} overflow="hidden" align="center" {...props}>
        <IconButton
          flex={1}
          size="sm"
          aria-label="Prev"
          icon={<ArrowBackIcon />}
          disabled={prevDisabled}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPrev && onPrev();
          }}
        />

        <IconButton
          flex={1}
          size="sm"
          aria-label="Next"
          icon={<ArrowForwardIcon />}
          disabled={nextDisabled}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onNext && onNext();
          }}
        />
      </Flex>
    );
  }
);
