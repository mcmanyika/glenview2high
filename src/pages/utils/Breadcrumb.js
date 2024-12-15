import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

const Breadcrumb = () => {
  const router = useRouter();
  const pathnames = router.asPath.split('/').filter((x) => x);

  const formatPath = (path) => {
    return path
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <nav className="flex items-center text-sm capitalize font-thin space-x-2 p-4 mt-6 
      bg-white dark:bg-gray-800 text-gray-700 dark:text-white
      transition-colors duration-200 dark:bg-gray-900">
      <Link href="/admin/dashboard">
        <span className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 
          hover:underline transition-colors duration-200">
          Home
        </span>
      </Link>
      {pathnames.map((path, index) => {
        const routeTo = `/`;
        const isLast = index === pathnames.length - 1;
        return (
          <span key={index} className="flex items-center space-x-2">
            <FiChevronRight className="inline-block h-4 w-4 text-gray-400 dark:text-gray-400" />
            <Link href={routeTo}>
              <span 
                className={`
                  ${isLast 
                    ? 'text-gray-400 dark:text-gray-400 cursor-text' 
                    : 'hover:text-gray-900 dark:hover:text-gray-200 hover:underline cursor-pointer transition-colors duration-200'
                  }
                `}
              >
                {formatPath(path)}
              </span>
            </Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
