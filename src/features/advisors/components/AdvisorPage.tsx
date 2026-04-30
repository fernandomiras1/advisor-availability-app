import { useMemo, useState } from "react";
import {
  Box,
  Container,
  MenuItem,
  Pagination,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { ADVISORS_ITEMS_PER_PAGE } from "../config/advisors.config";
import { useAdvisorAvailabilityPolling } from "../hooks/useAdvisorAvailabilityPolling";
import { useAdvisors } from "../hooks/useAdvisors";
import { AdvisorList } from "./AdvisorList";
import { AdvisorVirtualList } from "./AdvisorVirtualList";

type ViewMode = "pagination" | "infinite";

export function AdvisorPage() {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("pagination");
  const { data: advisors = [], isLoading, isError } = useAdvisors();

  const totalPages = Math.ceil(advisors.length / ADVISORS_ITEMS_PER_PAGE);

  const paginatedAdvisors = useMemo(() => {
    const startIndex = (page - 1) * ADVISORS_ITEMS_PER_PAGE;
    return advisors.slice(startIndex, startIndex + ADVISORS_ITEMS_PER_PAGE);
  }, [advisors, page]);

  const visibleAdvisors =
    viewMode === "pagination" ? paginatedAdvisors : advisors;
  const visibleAdvisorIds = useMemo(
    () => visibleAdvisors.map((advisor) => advisor.id),
    [visibleAdvisors],
  );

  useAdvisorAvailabilityPolling(visibleAdvisorIds);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={3}>
        <Box>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
          >
            <Box>
              <Typography variant="h1">{t("page.title")}</Typography>
              <Typography color="text.secondary">{t("page.subtitle")}</Typography>
            </Box>
            <Select
              size="small"
              value={i18n.resolvedLanguage ?? "en"}
              onChange={(event) => {
                void i18n.changeLanguage(event.target.value);
              }}
              inputProps={{ "aria-label": t("page.languageLabel") }}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="es">ES</MenuItem>
            </Select>
          </Stack>
        </Box>

        <ToggleButtonGroup
          color="primary"
          exclusive
          value={viewMode}
          onChange={(_, value: ViewMode | null) => value && setViewMode(value)}
          aria-label={t("page.viewModeAria")}
          size="small"
        >
          <ToggleButton value="pagination">{t("page.pagination")}</ToggleButton>
          <ToggleButton value="infinite">{t("page.infinite")}</ToggleButton>
        </ToggleButtonGroup>

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState />
        ) : advisors.length === 0 ? (
          <EmptyState />
        ) : viewMode === "pagination" ? (
          <>
            <AdvisorList advisors={paginatedAdvisors} />
            <Stack sx={{ alignItems: "center" }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, nextPage) => setPage(nextPage)}
                color="primary"
                aria-label={t("page.paginationAria")}
              />
            </Stack>
          </>
        ) : (
          <AdvisorVirtualList advisors={advisors} />
        )}
      </Stack>
    </Container>
  );
}
