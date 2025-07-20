import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

interface ScenarioSwitcherProps {
  scenarios: { name: string }[];
  activeIndex: number;
  onChange: (index: number) => void;
}

const ScenarioSwitcher: React.FC<ScenarioSwitcherProps> = ({ scenarios, activeIndex, onChange }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Tabs
        value={activeIndex}
        onChange={(e, val) => onChange(val)}
        variant="fullWidth"
      >
        {scenarios.map((s, idx) => (
          <Tab key={idx} label={s.name} />
        ))}
      </Tabs>
    </Box>
  );
};

export default ScenarioSwitcher;
