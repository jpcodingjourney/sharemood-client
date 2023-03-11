import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { BACKEND_URL } from "config";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.dark;
  const medium = palette.neutral.dark;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="http://localhost:3001/assets/info4.jpeg"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>BeautyCare</Typography>
        <Typography color={medium}>beautycare.com</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Its exquisite formulation ensures that your skin is gently exfoliated,
        leaving it with a luminous and radiant glow.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
