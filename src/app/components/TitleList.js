import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  FaSignOutAlt, FaTachometerAlt, FaShoppingBag, FaPencilRuler, FaCalendarAlt, FaClipboardList, FaUserGraduate, FaHome, FaCashRegister,  FaChartLine, FaEnvelope, FaDollarSign, FaMoneyBillWave, FaWallet, FaCoins, FaFileAlt, 
} from 'react-icons/fa';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { LiaChalkboardTeacherSolid } from 'react-icons/lia';
import { IoPeopleOutline } from 'react-icons/io5';
import { RiAdminFill } from 'react-icons/ri';
import { FaCheckCircle } from 'react-icons/fa';

// Mapping icon names to their respective components
const iconMapping = {
  FaChartLine: FaChartLine,
  FaEnvelope: FaEnvelope,
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
  FaDollarSign: FaDollarSign,
  FaMoneyBillWave: FaMoneyBillWave,
  FaWallet: FaWallet,
  FaCoins: FaCoins,
  FaFileAlt: FaFileAlt,
};

const TitleList = ({ titles, onSignOut, isExpanded = false }) => {
  const defaultIcon = FaHome;
  
  const dashboardItem = titles.find((item) => item.title === 'Dashboard');
  const otherItems = titles
    .filter((item) => item.title !== 'Dashboard')
    .sort((a, b) => a.title.localeCompare(b.title));

  const sortedTitles = dashboardItem ? [dashboardItem, ...otherItems] : otherItems;

  return (
    <div className="flex flex-col items-center">
      {sortedTitles.map((rw) => {
        const IconComponent = iconMapping[rw.icon] || defaultIcon;
        return (
          <div 
            key={rw.id} 
            className="relative mb-2 w-full group"
          >
            <Link 
              href={rw.link} 
              className={`flex items-center w-full p-1 transition-all duration-200
                ${isExpanded 
                  ? 'px-4 hover:bg-slate-50 hover:rounded-full hover:text-black' 
                  : 'hover:bg-slate-50/10 rounded-xl'}`}
              aria-label={rw.title}
            >
              <div className={`flex items-center ${isExpanded ? 'w-full' : 'justify-center'}`}>
                <div className={`${isExpanded ? 'w-6' : 'w-12 flex justify-center'}`}>
                  <IconComponent className="text-3xl" />
                </div>
                <div 
                  className={`text-left font-thin pl-4 p-2 cursor-pointer overflow-hidden transition-all duration-200
                    ${isExpanded ? 'opacity-100 w-full' : 'w-0 opacity-0 p-0'}`}
                >
                  {rw.title}
                </div>
              </div>
            </Link>
            {/* Tooltip */}
            {!isExpanded && (
              <div className="absolute left-full ml-2 pl-2 py-1 px-3 bg-white text-black rounded-md 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200
                whitespace-nowrap z-50 shadow-lg -translate-x-2 group-hover:translate-x-0">
                {rw.title}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Sign Out Button */}
      <div className="relative w-full group">
        <button
          onClick={onSignOut}
          className={`flex items-center w-full p-1 transition-all duration-200
            ${isExpanded 
              ? 'px-4 hover:bg-slate-50 hover:rounded-full hover:text-black' 
              : 'hover:bg-slate-50/10 rounded-xl'}`}
          aria-label="Sign Out"
        >
          <div className={`flex items-center ${isExpanded ? 'w-full' : 'justify-center'}`}>
            <div className={`${isExpanded ? 'w-6' : 'w-12 flex justify-center'}`}>
              <FaSignOutAlt className="text-3xl" />
            </div>
            <div 
              className={`text-left font-thin px-4 p-2 cursor-pointer overflow-hidden transition-all duration-200
                ${isExpanded ? 'opacity-100 w-full' : 'w-0 opacity-0 p-0'}`}
            >
              Sign Out
            </div>
          </div>
        </button>
        {/* Tooltip for Sign Out */}
        {!isExpanded && (
          <div className="absolute left-full ml-2 pl-2 py-1 px-3 bg-white text-black rounded-md 
            opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200
            whitespace-nowrap z-50 shadow-lg -translate-x-2 group-hover:translate-x-0">
            Sign Out
          </div>
        )}
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
  isExpanded: PropTypes.bool,
};

export default TitleList;
