import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

const Breadcrumb = () => {
  const router = useRouter();
  const pathnames = router.asPath.split('/').filter((x) => x);

  return (
    <nav className="flex items-center text-sm capitalize font-thin space-x-2 pl-1 p-5">
      <Link href="/">
        <span className="cursor-pointer hover:underline">Home</span>
      </Link>
      {pathnames.map((path, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return (
          <span key={index} className="flex items-center space-x-2">
            <FiChevronRight className="inline-block h-4 w-4 text-gray-500" />
            <Link href={routeTo}>
              <span className={isLast ? 'text-gray-500 cursor-text' : 'hover:underline cursor-pointer'}>
                {path}
              </span>
            </Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
