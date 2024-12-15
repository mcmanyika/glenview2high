import Image from 'next/image';
import Link from 'next/link';

const LatestNews = () => {
  const newsData = [
    {
      id: 1,
      title: "",
      image: "https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2FDSC_6074jpg?alt=media&token=a7266fe4-97f9-4765-873f-bcc00b5111c9", // Replace with your image URL
      
    },
    {
      id: 2,
      title: " ",
      image: "https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2FDSC_5888.jpg?alt=media&token=7b367dd8-fe8c-4920-bb82-5f1913617774", // Replace with your image URL
      
    },
    {
      id: 3,
      title: "",
      image: "https://firebasestorage.googleapis.com/v0/b/divaris-3e59f.appspot.com/o/images%2FDSC_5912.jpg?alt=media&token=c281fc1d-e2ae-4f34-9165-cea2c8893324", // Replace with your image URL
    },
  ];

  return (
    <div className="w-full p-0 px-4 py-8 bg-white">
        <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Latest News</h2>
        <Link href="/news" className="text-blue-600 hover:underline">
          View All News &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newsData.map((news) => (
          <div
            key={news.id}
            className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-48">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-yellow-300 text-white p-4">
              <h3 className="text-lg font-semibold">{news.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default LatestNews;
