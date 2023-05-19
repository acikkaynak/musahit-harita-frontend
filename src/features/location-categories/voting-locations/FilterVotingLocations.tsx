import { Filter } from "@/components/Filter/Filter";
import { FilterHeader } from "@/components/Filter/FilterHeader";
import { useTranslation } from "next-i18next";
import { FilterControl } from "@/components/Filter/FilterControl";
import { FilterOptions } from "@/utils/filterTime";
import { MenuItem, SelectChangeEvent } from "@mui/material";
import { useVotingLocations } from "./useVotingLocations";

import cities from "@/data/tr-cities.json";

export const FilterVotingLocations = () => {
  const { t } = useTranslation("home");
  const {
    isOpen,
    actions,
    selectedCityId,
    selectedDistrictId,
    selectedNeighborhoodId,
    selectedSchoolId,
  } = useVotingLocations();

  if (!isOpen) {
    return null;
  }

  return (
    <Filter
      isOpen={isOpen}
      header={
        <FilterHeader
          title={t("filter.findVotingLocationsTitle")}
          onClose={() => {
            actions.setIsOpen(false);
          }}
        />
      }
    >
      <FilterControl
        value={selectedCityId}
        label={t("filter.city")}
        onChange={(event: SelectChangeEvent<number>) => {
          const { value } = event.target;
          if (typeof value !== "number") return;
          actions.setSelectedCityId(value);
        }}
      >
        {cities.map((city) => {
          return (
            <MenuItem key={city.id} value={city.id ?? ""}>
              {city.name}
            </MenuItem>
          );
        })}
      </FilterControl>

      <FilterControl
        value={selectedDistrictId ?? ""}
        label={t("filter.district")}
        onChange={(event: SelectChangeEvent<number>) => {
          const { value } = event.target;

          if (typeof value !== "number") return;

          actions.setSelectedDistrictId(value);
        }}
      >
        {cities.map((city) => {
          return (
            <MenuItem key={city.id} value={city.id}>
              {/* cityTransformer */}
              {/* We don't know data yet but it should be city.name */}
              {city.name}
            </MenuItem>
          );
        })}
      </FilterControl>

      <FilterControl
        value={selectedNeighborhoodId ?? ""}
        label={t("filter.neighborhood")}
        onChange={(event: SelectChangeEvent<number>) => {
          const { value } = event.target;

          if (typeof value !== "number") return;

          actions.setSelectedNeighborhoodId(value);
        }}
      >
        {FilterOptions.map((option, idx) => {
          return (
            <MenuItem key={idx} value={option.inMilliseconds}>
              {/* cityTransformer */}
              {/* We don't know data yet but it should be city.name */}
              {t(`filter.time.${option.label}`)}
            </MenuItem>
          );
        })}
      </FilterControl>

      <FilterControl
        value={selectedSchoolId ?? ""}
        label={t("filter.school")}
        onChange={(event: SelectChangeEvent<number>) => {
          const { value } = event.target;

          if (typeof value !== "number") return;

          actions.setSelectedSchoolId(value);
        }}
      >
        {FilterOptions.map((option, idx) => {
          return (
            <MenuItem key={idx} value={option.inMilliseconds}>
              {/* cityTransformer */}
              {/* We don't know data yet but it should be city.name */}
              {t(`filter.time.${option.label}`)}
            </MenuItem>
          );
        })}
      </FilterControl>
    </Filter>
  );
};
