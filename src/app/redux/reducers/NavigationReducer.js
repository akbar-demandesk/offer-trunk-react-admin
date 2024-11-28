import { getNavigations } from 'app/navigations';
import { SET_USER_NAVIGATION } from '../actions/NavigationAction';

const roleId = localStorage.getItem('roleId');
const navigationItems = getNavigations(roleId);

const NavigationReducer = function (state = navigationItems, action) {
  switch (action.type) {
    case SET_USER_NAVIGATION: {
      return [...action.payload];
    }
    default: {
      return [...state];
    }
  }
};

export default NavigationReducer;
