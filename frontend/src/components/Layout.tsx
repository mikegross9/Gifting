import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Users, Calendar, LogOut, Home } from 'lucide-react';
import { useAuth } from '../utils/authContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <Gift className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">GiftPlanner</span>
              </Link>

              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600"
                >
                  <Home className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <Link
                  to="/contacts"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  <Users className="h-4 w-4 mr-1" />
                  Contacts
                </Link>
                <Link
                  to="/events"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Events
                </Link>
                <Link
                  to="/gifts"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  <Gift className="h-4 w-4 mr-1" />
                  Gifts
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">
                Welcome, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
