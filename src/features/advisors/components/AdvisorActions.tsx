import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

interface AdvisorActionsProps {
  isCallAvailable: boolean;
  isChatAvailable: boolean;
}

export function AdvisorActions({
  isCallAvailable,
  isChatAvailable,
}: AdvisorActionsProps) {
  const { t } = useTranslation();
  const callLabel = isCallAvailable ? t("actions.callNow") : t("actions.callLater");
  const callAriaLabel = isCallAvailable ? t("a11y.callNow") : t("a11y.callLater");
  const chatLabel = isChatAvailable ? t("actions.chatNow") : t("actions.chatLater");
  const chatAriaLabel = isChatAvailable ? t("a11y.chatNow") : t("a11y.chatLater");

  return (
    <Stack
      direction="column"
      spacing={1.5}
      sx={{ width: { xs: "100%", sm: "auto" } }}
    >
      <Button
        variant="contained"
        color="primary"
        disabled={!isCallAvailable}
        aria-label={callAriaLabel}
      >
        {callLabel}
      </Button>

      <Button
        variant="contained"
        color="secondary"
        disabled={!isChatAvailable}
        aria-label={chatAriaLabel}
      >
        {chatLabel}
      </Button>
    </Stack>
  );
}
