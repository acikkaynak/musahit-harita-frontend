import { HelpOutline } from "@mui/icons-material";
import {
  MapTypeMapLayerViewComponent,
  useMTMLView,
} from "../../MTMLView/MTMLView";
import { MapType } from "../../MTMLView/types";
import { AttributionComponent } from "../../Attributions/Attributions";
import {
  ButtonGroup,
  IconButton,
  Stack,
  SxProps,
  Theme,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { LocaleSwitchComponent } from "../../LocaleSwitch/LocaleSwitch";
import { FilterButtonComponent } from "../../Button/Filter";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LayersIcon from "@mui/icons-material/Layers";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useMap } from "react-leaflet";
import { Control } from "./Control";
import { LayerButton } from "./LayerButton";
import { useHelpView } from "../../UserGuide/UserGuide";
import { useTranslation } from "next-i18next";
import { DoubleClickStopPropagation } from "@/components/DoubleClickStopPropagation";
import {
  FilterVotingLocations,
  useVotingLocations,
  useVotingLocationsData,
} from "@/features/location-categories";
import { DataSourcesInfo } from "@/components/DataSourcesInfo/DataSourcesInfo";
import { useState } from "react";
import { useAboutView } from "@/components/AboutUs/AboutUsOverlay";

const typeImages: Record<MapType, string> = {
  [MapType.Default]: "default",
  [MapType.Satellite]: "satellite",
  [MapType.Terrain]: "terrain",
};
interface IStyles {
  [key: string]: SxProps<Theme>;
}

const MapZoomControl = () => {
  const parentMap = useMap();
  return (
    <Box>
      <ButtonGroup
        sx={styles.button}
        size="small"
        orientation="vertical"
        aria-label="small button group"
      >
        <IconButton
          color="inherit"
          onClick={() => {
            parentMap.zoomIn();
          }}
        >
          <AddIcon />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={() => {
            parentMap.zoomOut();
          }}
        >
          <RemoveIcon />
        </IconButton>
      </ButtonGroup>
    </Box>
  );
};

interface IMapLayerControlProps {
  showOnly: "mobile" | "desktop";
}

const MapLayerControl = (props: IMapLayerControlProps) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const mtmlView = useMTMLView();

  return matches ? (
    props.showOnly === "desktop" ? (
      <LayerButton
        onClick={() => mtmlView.toggle(!mtmlView.isOpen)}
        image={typeImages[mtmlView.mapType]}
        checked={false}
      />
    ) : null
  ) : props.showOnly === "mobile" ? (
    <Box>
      <IconButton
        sx={styles.button}
        color="inherit"
        onClick={() => mtmlView.toggle(!mtmlView.isOpen)}
      >
        <LayersIcon />
      </IconButton>
    </Box>
  ) : null;
};

const HelpViewControl = () => {
  const helpView = useHelpView();
  const aboutView = useAboutView();
  return (
    <Box sx={styles.buttonBox}>
      <IconButton
        sx={styles.button}
        color="inherit"
        onClick={() => {
          helpView.toggle(!helpView.isOpen);
          aboutView.toggle(false);
        }}
      >
        <HelpOutline />
      </IconButton>
      <IconButton
        sx={styles.button}
        color="inherit"
        onClick={() => {
          aboutView.toggle(!aboutView.isOpen);
          helpView.toggle(false);
        }}
      >
        <InfoOutlinedIcon />
      </IconButton>
    </Box>
  );
};

export const MapControls = () => {
  const { t } = useTranslation("home");

  useVotingLocationsData();

  const votingLocationsFilter = useVotingLocations();
  const [dataSourcesOpen, setDataSourcesOpen] = useState(false);

  return (
    <DoubleClickStopPropagation>
      <div>
        <Control position="topleft">
          <DoubleClickStopPropagation>
            <Stack display={"flex"} direction={"column"} rowGap={1}>
              <MapZoomControl />
              <MapLayerControl showOnly={"mobile"} />
              <HelpViewControl />
            </Stack>
          </DoubleClickStopPropagation>
        </Control>
        <Control position="bottomleft">
          <Stack display={"flex"} direction={"column"} rowGap={1}>
            <MapTypeMapLayerViewComponent />
            <MapLayerControl showOnly={"desktop"} />
          </Stack>
        </Control>

        <Control position="topright">
          <Stack
            display={"flex"}
            direction={"column"}
            rowGap={2}
            alignItems={"flex-end"}
          >
            <Stack display={"flex"} direction={"row"} columnGap={2}>
              <FilterButtonComponent
                buttonLabel={t("filter.findVotingLocationsTitle")}
                icon={<SearchIcon />}
                onClick={() => {
                  votingLocationsFilter.actions.setIsOpen(
                    !votingLocationsFilter.isOpen
                  );
                }}
              />
            </Stack>
            <Stack display={"flex"} direction={"row"} columnGap={2}>
              <FilterVotingLocations />
            </Stack>
          </Stack>
        </Control>
        <DataSourcesInfo
          open={dataSourcesOpen}
          onClick={() => setDataSourcesOpen(false)}
        />
        <Control position="bottomright">
          <Stack
            display={"flex"}
            direction={"column"}
            rowGap={1}
            alignItems={"flex-end"}
          >
            <Stack display={"flex"} direction={"row"}>
              <LocaleSwitchComponent />
            </Stack>
            <Stack display={"flex"} direction={"row"}>
              <AttributionComponent onClick={() => setDataSourcesOpen(true)} />
            </Stack>
          </Stack>
        </Control>
      </div>
    </DoubleClickStopPropagation>
  );
};

const styles: IStyles = {
  button: (theme: Theme) => ({
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.grey[300]}`,
    color: `${theme.palette.grey[700]} !important`,
    borderRadius: "8px !important",
    [theme.breakpoints.down("sm")]: {
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    },
    "&:hover": {
      backgroundColor: theme.palette.common.white,
    },
  }),
  buttonBox: () => ({
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
  }),
  marginTopLeft: {
    margin: "10px 10px",
  },
  marginLeft: {
    margin: "0px 0px 10px 10px",
  },
  pointerNone: {
    pointerEvents: "none",
  },
  pointerAll: {
    pointerEvents: "all",
  },
};
