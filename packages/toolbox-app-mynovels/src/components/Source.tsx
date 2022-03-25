import React, { useMemo } from "react";
import md5 from "js-md5";
import { Tag } from "@chakra-ui/react";

// 通过source的hash，mod至列表
const COLORS = [
  "whiteAlpha",
  "blackAlpha",
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "cyan",
  "purple",
  "pink",
  "linkedin",
  "facebook",
  "messenger",
  "whatsapp",
  "twitter",
  "telegram",
];
export const Source: React.FC<
  {
    source: string;
  } & Record<string, any>
> = ({ source, ...props }) => {
  const color = useMemo(() => {
    const h = md5.create();
    h.update(source);
    const colorIdx = h.digest().reduce((a, b) => a + b, 0) % COLORS.length;
    return COLORS[colorIdx];
  }, [source]);

  return (
    <Tag colorScheme={color} {...props}>
      {source}
    </Tag>
  );
};
