import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../../utils/firebaseConfig';

const ItemList = () => {
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const titleRef = ref(database, 'title');
        const statusQuery = query(titleRef, orderByChild('status'), equalTo('Active'));

        onValue(statusQuery, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const titlesArray = Object.keys(data)
              .map((key) => ({
                id: key,
                title: data[key].title,
                link: data[key].link,
                status: data[key].status,
                category: data[key].category,
              }))
              .filter(item => item.title !== 'Admissions' && item.title !== 'About' && item.category === 'title')
              .sort((a, b) => {
                if (a.title === 'Alumni') return 1;
                if (b.title === 'Alumni') return -1;
                return a.title.localeCompare(b.title);
              });
            setTitles(titlesArray);
          } else {
            setTitles([]);
          }
        });
      } catch (error) {
        console.error('Firebase Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='grid grid-cols-1 md:grid-cols-1'>
      {titles.length > 0 && titles.map((rw) => (
        <div key={rw.id}>
          <Link href={`${rw.link}`}>
            <div className="text-sm font-sans font-thin pb-2">{rw.title}</div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
