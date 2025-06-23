import Dashboard from '@/components/pages/Dashboard';
import Farms from '@/components/pages/Farms';
import Crops from '@/components/pages/Crops';
import Tasks from '@/components/pages/Tasks';
import Weather from '@/components/pages/Weather';
import Finances from '@/components/pages/Finances';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  farms: {
    id: 'farms',
    label: 'Farms',
    path: '/farms',
    icon: 'Map',
    component: Farms
  },
  crops: {
    id: 'crops',
    label: 'Crops',
    path: '/crops',
    icon: 'Sprout',
    component: Crops
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  },
  weather: {
    id: 'weather',
    label: 'Weather',
    path: '/weather',
    icon: 'Cloud',
    component: Weather
  },
  finances: {
    id: 'finances',
    label: 'Finances',
    path: '/finances',
    icon: 'DollarSign',
    component: Finances
  }
};

export const routeArray = Object.values(routes);
export default routes;