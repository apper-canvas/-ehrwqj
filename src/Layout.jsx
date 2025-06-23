import { useState, useContext } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';
import { AuthContext } from '@/App';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const user = useSelector((state) => state.user.user);
  
  if (!user) return null;
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 hidden sm:block">
        {user.firstName} {user.lastName}
      </span>
      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Logout"
      >
        <ApperIcon name="LogOut" size={16} />
        <span className="hidden sm:block">Logout</span>
      </button>
    </div>
  );
};
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-surface-100 md:hidden"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Sprout" size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-heading font-semibold text-primary">FarmFlow</h1>
            </div>
          </div>
<div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-white border-r border-surface-200 z-40">
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {routeArray.map(route => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'text-gray-700 hover:bg-surface-100 hover:text-primary'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={18} />
                  {route.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={closeSidebar}
              />
              <motion.aside
                initial={{ x: -264 }}
                animate={{ x: 0 }}
                exit={{ x: -264 }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-surface-200 z-50 md:hidden"
              >
                <div className="p-4 border-b border-surface-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <ApperIcon name="Sprout" size={18} className="text-white" />
                      </div>
                      <h1 className="text-xl font-heading font-semibold text-primary">FarmFlow</h1>
                    </div>
                    <button
                      onClick={closeSidebar}
                      className="p-2 rounded-lg hover:bg-surface-100"
                    >
                      <ApperIcon name="X" size={18} />
                    </button>
                  </div>
                </div>
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {routeArray.map(route => (
                      <NavLink
                        key={route.id}
                        to={route.path}
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-accent/10 text-accent border border-accent/20'
                              : 'text-gray-700 hover:bg-surface-100 hover:text-primary'
                          }`
                        }
                      >
                        <ApperIcon name={route.icon} size={18} />
                        {route.label}
                      </NavLink>
                    ))}
                  </div>
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-surface-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;