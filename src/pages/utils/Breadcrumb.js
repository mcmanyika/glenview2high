import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

const Breadcrumb = () => {
  const router = useRouter();
  const pathnames = router.asPath.split('/').filter((x) => x);

  const formatPath = (path) => {
    // Remove underscores and capitalize each word
    return path
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <nav className="flex items-center text-sm capitalize font-thin space-x-2 p-4">
      <Link href="/admin/dashboard">
        <span className="cursor-pointer hover:underline">Home</span>
      </Link>
      {pathnames.map((path, index) => {
        const routeTo = `/`;
        const isLast = index === pathnames.length - 1;
        return (
          <span key={index} className="flex items-center space-x-2">
            <FiChevronRight className="inline-block h-4 w-4 text-gray-500" />
            <Link href={routeTo}>
              <span className={isLast ? 'text-gray-500 cursor-text' : 'hover:underline cursor-pointer'}>
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
