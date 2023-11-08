import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Slider } from "antd";

type Props = {
  value: number[];
  minValue: number;
  maxValue: number;
  setter: (newValue: number | number[]) => void;
};

const SliderRangeAntd = ({ value, minValue, maxValue, setter }: Props) => {
  
  //Gestion du responsive
  const isMobile = window.innerWidth <= 600;
  const initVal = isMobile ? value[1] - 5 : value[0];

    
    //Eviter les valeur infini a l'ppel du composant
    if (Number.isFinite(initVal)) {
        useEffect(() => {
          setter([initVal, value[1]]);
        }, []);

    return (
      <Box>
        <Typography id="range-slider" gutterBottom>
          Années : {value[0]} - {value[1]}
        </Typography>
        <Slider
          range
          defaultValue={[initVal, value[1]]}
          min={minValue}
          max={maxValue}
          onChange={setter}
        />
      </Box>
    );
  } else {
    return false;
  }
};

export default SliderRangeAntd;
