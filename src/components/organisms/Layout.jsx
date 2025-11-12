import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CategorySidebar from "@/components/organisms/CategorySidebar";
const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              FlowTask
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                FlowTask
              </h1>
            </div>

            {/* Navigation placeholder - This would contain CategorySidebar in a real app */}
            <nav className="space-y-2">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                Quick Actions
              </div>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                  <ApperIcon name="Plus" className="w-5 h-5" />
                  <span className="font-medium">Add New Task</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                  <ApperIcon name="Search" className="w-5 h-5" />
                  <span className="font-medium">Search Tasks</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                  <ApperIcon name="Filter" className="w-5 h-5" />
                  <span className="font-medium">Filter & Sort</span>
                </button>
              </div>

              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 mt-8">
                Views
              </div>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-primary-600 bg-primary-50 rounded-lg font-medium">
                  <ApperIcon name="List" className="w-5 h-5" />
                  <span>All Tasks</span>
                  <span className="ml-auto bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs font-medium">
                    8
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                  <ApperIcon name="Clock" className="w-5 h-5" />
                  <span className="font-medium">Today</span>
                  <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                    3
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                  <ApperIcon name="Calendar" className="w-5 h-5" />
                  <span className="font-medium">This Week</span>
                  <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                    5
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                  <ApperIcon name="CheckCircle2" className="w-5 h-5" />
                  <span className="font-medium">Completed</span>
                  <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                    2
                  </span>
                </button>
              </div>

              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 mt-8">
                Categories
              </div>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <ApperIcon name="Briefcase" className="w-4 h-4" />
                  <span className="font-medium">Work</span>
                  <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                    4
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <ApperIcon name="Code" className="w-4 h-4" />
                  <span className="font-medium">Development</span>
                  <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                    3
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <ApperIcon name="User" className="w-4 h-4" />
                  <span className="font-medium">Personal</span>
                  <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                    2
                  </span>
                </button>
</div>

              <div className="mt-8 pt-4 border-t border-gray-200">
                <Button
                  onClick={logout}
                  variant="ghost"
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
                >
                  <ApperIcon name="LogOut" className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </Button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={closeMobileMenu}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                        <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
                      </div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        FlowTask
                      </h1>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeMobileMenu}
                    >
                      <ApperIcon name="X" className="w-6 h-6" />
                    </Button>
                  </div>

                  {/* Mobile Navigation - Same content as desktop */}
                  <nav className="space-y-2">
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                      Quick Actions
                    </div>
                    <div className="space-y-1">
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                        <ApperIcon name="Plus" className="w-5 h-5" />
                        <span className="font-medium">Add New Task</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                        <ApperIcon name="Search" className="w-5 h-5" />
                        <span className="font-medium">Search Tasks</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                        <ApperIcon name="Filter" className="w-5 h-5" />
                        <span className="font-medium">Filter & Sort</span>
                      </button>
                    </div>

                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 mt-8">
                      Views
                    </div>
                    <div className="space-y-1">
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-primary-600 bg-primary-50 rounded-lg font-medium">
                        <ApperIcon name="List" className="w-5 h-5" />
                        <span>All Tasks</span>
                        <span className="ml-auto bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs font-medium">
                          8
                        </span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                        <ApperIcon name="Clock" className="w-5 h-5" />
                        <span className="font-medium">Today</span>
                        <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                          3
                        </span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                        <ApperIcon name="Calendar" className="w-5 h-5" />
                        <span className="font-medium">This Week</span>
                        <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                          5
                        </span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                        <ApperIcon name="CheckCircle2" className="w-5 h-5" />
                        <span className="font-medium">Completed</span>
                        <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                          2
                        </span>
                      </button>
                    </div>

                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 mt-8">
                      Categories
                    </div>
                    <div className="space-y-1">
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                        <ApperIcon name="Briefcase" className="w-4 h-4" />
                        <span className="font-medium">Work</span>
                        <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                          4
                        </span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <ApperIcon name="Code" className="w-4 h-4" />
                        <span className="font-medium">Development</span>
                        <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                          3
                        </span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <ApperIcon name="User" className="w-4 h-4" />
                        <span className="font-medium">Personal</span>
                        <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                          2
                        </span>
</button>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-200">
                      <Button
                        onClick={logout}
                        variant="ghost"
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
                      >
                        <ApperIcon name="LogOut" className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </Button>
                    </div>
                  </nav>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="max-w-4xl mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;