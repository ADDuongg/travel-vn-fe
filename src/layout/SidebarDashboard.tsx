// src/pages/dashboard/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import {
  FaFileInvoice,
  FaKey,
  FaRegHeart,
  FaTachometerAlt,
  FaUserEdit,
  FaUserTie,
} from 'react-icons/fa';
import { MdReviews } from 'react-icons/md';
import { FiBookOpen, FiLogOut } from 'react-icons/fi';
import { Separator } from '@/components/ui/separator';
import { ROUTES } from '@/constants/router';

const baseClasses =
  'flex items-center gap-2 px-5 py-3 rounded-xl w-fit transition-colors';
const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `${baseClasses} ${
    isActive
      ? 'bg-primary text-white'
      : 'text-gray-700 hover:bg-primary hover:text-white'
  }`;

const SidebarDashboard = () => {
  return (
    <div className="space-y-6 text-sm">
      {/* My Account */}
      <div>
        <h2 className="text-lg font-semibold mb-4">My Account</h2>
        <div className="space-y-2">
          <NavLink to={ROUTES.DASHBOARD.INDEX} end className={linkClasses}>
            <FaTachometerAlt /> Dashboard
          </NavLink>
          <NavLink to={ROUTES.DASHBOARD.PROFILE} className={linkClasses}>
            <FaUserEdit /> Edit Profile
          </NavLink>
          <NavLink
            to={ROUTES.DASHBOARD.TOUR_GUIDE_REGISTER}
            className={linkClasses}
          >
            <FaUserTie /> Tour Guide Profile
          </NavLink>
          <NavLink
            to={ROUTES.DASHBOARD.CHANGE_PASSWORD}
            className={linkClasses}
          >
            <FaKey /> Change Password
          </NavLink>
        </div>
      </div>

      {/* Tour Booking */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Tour Booking</h2>
        <div className="space-y-2">
          <NavLink to={ROUTES.DASHBOARD.TOUR_BOOKINGS} className={linkClasses}>
            <FiBookOpen /> My Bookings
          </NavLink>
          <NavLink to={ROUTES.DASHBOARD.INVOICES} className={linkClasses}>
            <FaFileInvoice /> Invoices
          </NavLink>
          <NavLink to={ROUTES.DASHBOARD.REVIEWS} className={linkClasses}>
            <MdReviews /> Reviews
          </NavLink>
          <NavLink to={ROUTES.DASHBOARD.WISHLIST} className={linkClasses}>
            <FaRegHeart /> Wish List
          </NavLink>
        </div>
      </div>

      {/* Room Booking */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Room Booking</h2>
        <div className="space-y-2">
          <NavLink to={ROUTES.DASHBOARD.ROOM_BOOKINGS} className={linkClasses}>
            <FiBookOpen /> My Bookings
          </NavLink>
          <NavLink to={ROUTES.DASHBOARD.ROOM_INVOICES} className={linkClasses}>
            <FaFileInvoice /> Invoices
          </NavLink>
          <NavLink to={ROUTES.DASHBOARD.ROOM_REVIEWS} className={linkClasses}>
            <MdReviews /> Reviews
          </NavLink>
        </div>
      </div>

      <Separator />

      {/* Sign out */}
      <button
        className={`${baseClasses} text-gray-700 hover:bg-primary hover:text-white`}
      >
        <FiLogOut /> Sign Out
      </button>

      {/* Help */}
      <div className="pt-6 text-sm">
        <p className="font-semibold">Need Help?</p>
        <p className="text-gray-600">1.828.456.345</p>
        <a href="mailto:help@traveltourwp.com" className="text-blue-600">
          help@traveltourwp.com
        </a>
      </div>
    </div>
  );
};

export default SidebarDashboard;
