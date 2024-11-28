import { Icon, IconButton, useMediaQuery } from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import { themeShadows } from 'app/components/MatxTheme/themeColors';
import useAuth from 'app/hooks/useAuth';
import useSettings from 'app/hooks/useSettings';
import { topBarHeight } from 'app/utils/constant';
import React from 'react';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.success,
}));

const TopbarRoot = styled('div')(({ theme }) => ({
  top: 0,
  zIndex: 96,
  transition: 'all 0.3s ease',
  boxShadow: themeShadows[8],
  height: topBarHeight,
}));

const TopbarContainer = styled(Box)(({ theme }) => ({
  padding: '8px',
  paddingLeft: 18,
  paddingRight: 20,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: theme.palette.success.main,
  [theme.breakpoints.down('sm')]: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  [theme.breakpoints.down('xs')]: {
    paddingLeft: 14,
    paddingRight: 16,
  },
}));

const IconBox = styled('div')(({ theme }) => ({
  display: 'inherit',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const Layout1Topbar = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const { logout } = useAuth();
  const isMdScreen = useMediaQuery(theme.breakpoints.down('md'));

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: { leftSidebar: { ...sidebarSettings } },
    });
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === 'close' ? 'mobile' : 'close';
    } else {
      mode = layout1Settings.leftSidebar.mode === 'full' ? 'close' : 'full';
    }
    updateSidebarMode({ mode });
  };

  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box display="flex">
          <StyledIconButton onClick={handleSidebarToggle}>
            <Icon>menu</Icon>
          </StyledIconButton>
        </Box>
        {/* <IconBox>
          <StyledIconButton onClick={logout}>
            <Icon>power_settings_new</Icon>
          </StyledIconButton>
        </IconBox> */}
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default React.memo(Layout1Topbar);
