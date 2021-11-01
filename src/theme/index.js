import merge from 'lodash/merge';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { THEMES } from '../constants';
import { lightShadows, darkShadows } from './shadows';

const baseOptions = {
  direction: 'ltr',
  components: {
    MuiAvatar: {
      styleOverrides: {
        fallback: {
          height: '75%',
          width: '75%'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: 'h6'
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          marginRight: '16px'
        }
      }
    }
  },
  typography: {
    button: {
      fontWeight: 600
    },
    fontFamily: 'Montserrat',
    h1: {
      fontWeight: 600,
      fontSize: '3.5rem'
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem'
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem'
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem'
    },
    h7: {
      fontWeight: 600,
      fontSize: '.85rem',
      fontFamily: 'Montserrat'
    },
    h8: {
      fontWeight: 600,
      fontSize: '.7rem',
      fontFamily: 'Montserrat'
    },
    overline: {
      fontWeight: 600
    }
  }
};

const persist = {
  background: {
    default: '#f4f5f7',
    paper: '#ffffff',
    contrast: '#000000'
  },
  text: {
    primary: '#172b4d',
    secondary: '#6b778c',
    contrast: '#ffffff'
  },
};

const themesOptions = {
  [THEMES.LIGHT]: {
    components: {
      MuiInputBase: {
        styleOverrides: {
          input: {
            '&::placeholder': {
              opacity: 0.86,
              color: '#42526e'
            }
          }
        }
      }
    },
    palette: {
      action: {
        active: '#6b778c'
      },
      background: {
        default: '#f4f5f7',
        paper: '#ffffff',
        contrast: '#000000',
        defaultPersist: persist.background.default,
        paperPersist: persist.background.paper,
        contrastPersist: persist.background.contrast
      },
      error: {
        contrastText: '#ffffff',
        main: '#f44336'
      },
      mode: 'light',
      primary: {
        contrastText: '#ffffff',
        main: '#000000'
      },
      text: {
        primary: '#172b4d',
        secondary: '#6b778c',
        contrast: '#ffffff',
        primaryPersist: persist.text.primary,
        secondaryPersist: persist.text.secondary,
        contrastPersist: persist.text.contrast
      },
      standard: {
        primary: '#f50057',
        secondary: '#000000'
      },
      success: {
        contrastText: '#ffffff',
        main: '#4caf50'
      },
      warning: {
        contrastText: '#ffffff',
        main: '#ff9800'
      },
      border: {
        thick: 0
      }    },
    shadows: lightShadows
  },
  [THEMES.DARK]: {
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid rgba(145, 158, 171, 0.24)'
          }
        }
      }
    },
    palette: {
      background: {
        default: '#111',
        paper: '#000',
        contrast: '#fff',
        defaultPersist: persist.background.default,
        paperPersist: persist.background.paper,
        contrastPersist: persist.background.contrast
      },
      divider: 'rgba(145, 158, 171, 0.24)',
      error: {
        contrastText: '#ffffff',
        main: '#f44336'
      },
      mode: 'dark',
      primary: {
        contrastText: '#ffffff',
        main: '#688eff'
      },
      text: {
        primary: '#fff',
        secondary: '#919eab',
        contrast: '#000',
        primaryPersist: persist.text.primary,
        secondaryPersist: persist.text.secondary,
        contrastPersist: persist.text.contrast
      },
      standard: {
        primary: '#f50057',
        secondary: '#000000'
      },
      success: {
        contrastText: '#ffffff',
        main: '#4caf50'
      },

      warning: {
        contrastText: '#ffffff',
        main: '#ff9800'
      },
      border: {
        thick: 8
      }
    },
    shadows: darkShadows
  },
  [THEMES.NATURE]: {
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid rgba(145, 158, 171, 0.24)'
          }
        }
      }
    },
    palette: {
      background: {
        default: '#1c2531',
        paper: '#293142'
      },
      divider: 'rgba(145, 158, 171, 0.24)',
      error: {
        contrastText: '#ffffff',
        main: '#f44336'
      },
      mode: 'dark',
      primary: {
        contrastText: '#ffffff',
        main: '#01ab56'
      },
      success: {
        contrastText: '#ffffff',
        main: '#4caf50'
      },
      text: {
        primary: '#ffffff',
        secondary: '#919eab'
      },
      warning: {
        contrastText: '#ffffff',
        main: '#ff9800'
      }
    },
    shadows: darkShadows
  }
};

export const createTheme = (config = {}) => {
  let themeOptions = themesOptions[config.theme];

  if (!themeOptions) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    themeOptions = themesOptions[THEMES.LIGHT];
  }

  let theme = createMuiTheme(merge({}, baseOptions, themeOptions, {
    ...(config.roundedCorners && {
      shape: {
        borderRadius: 16
      }
    })
  }, {
    direction: config.direction
  }));

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
