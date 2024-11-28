function getNavigations(roleId) {
  let navigations = [];
  if (roleId === '1') {
    navigations = [
      {
        name: 'Profile',
        path: '/profile',
        icon: 'person',
      },
      { name: 'Network', path: '/network', icon: 'bar_chart' },
      // { name: 'Offers', path: '/offer', icon: 'movie_ticket' },
      {
        name: 'Traffic Sources',
        path: '/traffic-sources',
        icon: 'traffic_signalt',
      },
      { name: 'Logout', path: '/master/logout', icon: 'power_settings_new' },
    ];
  } else {
      navigations = [
        { name: 'Offer', path: '/offer', icon: 'movie' },
        { name: 'Network', path: '/network', icon: 'bar_chart' },
        {
          name: 'Traffic Sources',
          path: '/traffic-sources',
          icon: 'traffic_signalt',
        },
        { name: 'Logout', path: '/master/logout', icon: 'power_settings_new' },
      ];
  }
  return navigations;
}

export { getNavigations };
