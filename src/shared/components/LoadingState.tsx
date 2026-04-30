import { Card, CardContent, Skeleton, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

export function LoadingState() {
  const { t } = useTranslation();

  return (
    <Stack spacing={2} role="status" aria-label={t("states.loadingAria")}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} component="article" aria-hidden>
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: "center", minWidth: 0 }}
              >
                <Skeleton variant="circular" width={72} height={72} />
                <Stack spacing={1}>
                  <Skeleton variant="text" width={180} height={32} />
                  <Skeleton variant="text" width={120} />
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Skeleton variant="rounded" width={96} height={36} />
                <Skeleton variant="rounded" width={96} height={36} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
