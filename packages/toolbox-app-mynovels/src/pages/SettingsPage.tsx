import { Box, Input, Select, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAppConfig, useI18n } from "toolbox-framework";

const SettingsPage: React.FC<{}> = (props) => {
  const [t, i18n] = useI18n();
  const { value: server, update: updateServer } = useAppConfig(
    "server.url",
    ""
  );
  const { update: updateLang } = useAppConfig("server.lang", "");

  const [iptVal, setIptVal] = useState(server);

  useEffect(() => {
    setIptVal(server);
  }, [server]);

  return (
    <Box p={2}>
      <Box p={2}>
        <Text>{t("app.mynovels.settings.lang")}</Text>
        <Select
          variant="outline"
          value={i18n.lang}
          onChange={(v) => {
            updateLang(v.target.value);
            i18n.change(v.target.value);
          }}
        >
          {i18n.langs().map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
      </Box>

      <Box p={2}>
        <Text>{t("app.mynovels.settings.server")}</Text>
        <Input
          value={iptVal}
          onChange={(e) => setIptVal(e.target.value)}
          onBlur={() => {
            updateServer(iptVal);
          }}
        />
      </Box>
    </Box>
  );
};

export default SettingsPage;
