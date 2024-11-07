import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  FaSignOutAlt, FaTachometerAlt, FaShoppingBag, FaPencilRuler, FaCalendarAlt, FaClipboardList, FaUserGraduate, FaHome, FaCashRegister,
} from 'react-icons/fa';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { IoPeopleOutline } from 'react-icons/io5';
import { RiAdminFill } from 'react-icons/ri';

// Mapping icon names to their respective components
const iconMapping = {
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
    <ul className="flex flex-col items-center">
      {sortedTitles.map((rw) => {
        const IconComponent = iconMapping[rw.icon] || defaultIcon; // Fallback to default icon if not found
        return (
          <li key={rw.id} className="mb-4 flex flex-col items-center">
            <Link href={rw.link} className="flex flex-col items-center" aria-label={rw.title}>
              <IconComponent className="text-2xl" />
              <div className="text-center font-thin p-2 cursor-pointer w-full">{rw.title}</div>
            </Link>
          </li>
        );
      })}
      <li className="mb-4 flex flex-col items-center">
        <button
          onClick={onSignOut}
          className="flex flex-col items-center text-center font-thin p-2 rounded cursor-pointer w-full"
          aria-label="Sign Out"
        >
          <FaSignOutAlt className="text-2xl" />
          Sign Out
        </button>
      </li>
    </ul>
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
