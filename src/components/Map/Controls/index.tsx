import { useState } from "react";
import { HelpOutline } from "@mui/icons-material";
import {
  MapTypeMapLayerViewComponent,
  useMTMLView,
} from "../../MTMLView/MTMLView";
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
import CloseIcon from "@mui/icons-material/Close";
import { useMap } from "react-leaflet";
import { Control } from "./Control";
import { LayerButton } from "./LayerButton";
import { useHelpView } from "../../UserGuide/UserGuide";
import { useTranslation } from "next-i18next";
import { DoubleClickStopPropagation } from "@/components/DoubleClickStopPropagation";
import {
  FilterVotingLocations,
  useVotingLocations,
} from "@/features/location-categories";
import { useAboutView } from "@/components/AboutUs/AboutUsOverlay";
import { CooldownButtonComponent } from "@/components/Button/Cooldown";

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
        image={"default"}
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

      <IconButton
        sx={styles.imgButton}
        color="inherit"
        href="https://linktr.ee/acikyazilimagi"
      >
        <Box
          component={"img"}
          src="/images/AYA.png"
          width={42}
          height={42}
          alt={"Açık Yazılım Ağı"}
        />
      </IconButton>
    </Box>
  );
};

export const MapControls = () => {
  const { t } = useTranslation("home");

  const votingLocationsFilter = useVotingLocations();
  const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(true);

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
              <AttributionComponent />
            </Stack>
          </Stack>
        </Control>

        <Box sx={styles.fixedMidBottom}>
          {infoSnackbarOpen && (
            <Box sx={styles.infoSnackbar}>
              <Box sx={styles.infoSnackbarText}>
                Haritada görmüş olduğunuz bu veriler Oy ve Ötesi tarafından
                sağlanmış olup, tutanak sağlayacak gönüllü ihtiyacını
                göstermektedir. İhtiyaç olmayan bölgeler haritada
                gösterilmemektedir.
              </Box>

              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setInfoSnackbarOpen(false)}
                sx={styles.infoSnackbarCloseButton}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <CooldownButtonComponent />
        </Box>
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
  imgButton: (theme: Theme) => ({
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.grey[300]}`,
    color: `${theme.palette.grey[700]} !important`,
    borderRadius: "8px !important",
    [theme.breakpoints.down("sm")]: {
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    },
    padding: "0px !important",
    overflow: "hidden",
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
  fixedMidBottom: () => ({
    position: "fixed",
    bottom: "32px",
    left: "0px",
    width: "100%",
    zIndex: 1030,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  }),
  infoSnackbar: {
    background: "#fff",
    boxShadow: "0px 2px 4px rgba(22, 22, 22, 0.16)",
    borderRadius: "16px",
    pointerEvents: "all",
    margin: "0 8px 12px 8px",
    maxWidth: "420px",
    display: "flex",
    alignItems: "flex-start",
  },
  infoSnackbarText: {
    fontSize: "14px",
    padding: "12px 0 12px 12px",
  },
  infoSnackbarCloseButton: {
    position: "relative",
    top: "4px",
    right: "4px",
  },
};
