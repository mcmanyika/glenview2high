import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  FaSignOutAlt, FaTachometerAlt, FaShoppingBag, FaPencilRuler, FaCalendarAlt, FaClipboardList, FaUserGraduate, FaHome, FaCashRegister,  FaChartLine,
} from 'react-icons/fa';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { IoPeopleOutline } from 'react-icons/io5';
import { RiAdminFill } from 'react-icons/ri';
import { FaCheckCircle } from 'react-icons/fa';

// Mapping icon names to their respective components
const iconMapping = {
  FaChartLine: FaChartLine,
  FaTachometerAlt: FaTachometerAlt,
  FaPencilRuler: FaPencilRuler,
  FaCalendarAlt: FaCalendarAlt,
  FaClipboardList: FaClipboardList,
  FaUserGraduate: FaUserGraduate,
  MdOutlineLibraryBooks: MdOutlineLibraryBooks,
  LiaChalkboardTeacherSolid: LiaChalkboardTeacherSolid,
  IoPeopleOutline: IoPeopleOutline,
  RiAdminFill: RiAdminFill,
  FaHome: FaHome,
  FaCheckCircle: FaCheckCircle,
  FaCashRegister: FaCashRegister,
  FaShoppingBag: FaShoppingBag,
};

const TitleList = ({ titles, onSignOut }) => {
  const defaultIcon = FaHome; // Fallback icon
  
  // Separate "Dashboard" and sort the rest
  const dashboardItem = titles.find((item) => item.title === 'Dashboard');
  const otherItems = titles
    .filter((item) => item.title !== 'Dashboard')
    .sort((a, b) => a.title.localeCompare(b.title));

  const sortedTitles = dashboardItem ? [dashboardItem, ...otherItems] : otherItems;

  return (
    <div className="flex flex-col items-center">
      {sortedTitles.map((rw) => {
        const IconComponent = iconMapping[rw.icon] || defaultIcon; // Fallback to default icon if not found
        return (
          <div key={rw.id} className="mb-4 flex items-center w-full hover:px-4 hover:rounded-full hover:bg-slate-50 hover:text-black p-1">
            <Link href={rw.link} className="flex items-center w-full" aria-label={rw.title}>
              <div className="flex items-center space-x-2 w-full"> {/* Reduced space to space-x-2 */}
                <div className="w-5">
                  <IconComponent className="text-2xl" />
                </div>
                <div className="text-left font-thin p-2 cursor-pointer w-full">{rw.title}</div>
              </div>
            </Link>
          </div>
        );
      })}
      <div className="flex items-center w-full hover:bg-slate-50 hover:px-4 hover:rounded-full hover:text-black p-1"> {/* Reduced space here as well */}
        <div className="w-6">
          <FaSignOutAlt className="text-2xl" />
        </div>
        <div className="text-left font-thin  cursor-pointer w-full">
          <button
            onClick={onSignOut}
            className="flex items-center font-thin p-2 rounded-full cursor-pointer w-full"
            aria-label="Sign Out"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

TitleList.propTypes = {
  titles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ).isRequired,
  onSignOut: PropTypes.func.isRequired,
};

export default TitleList;
