import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../../../utils/firebaseConfig';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    const eventsRef = ref(database, 'events');

    const unsubscribe = onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const eventsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // Sort events by date in descending order
        eventsArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Limit to 10 events
        const limitedEvents = eventsArray.slice(0, 10);

        setEvents(limitedEvents);
        setTotalEvents(limitedEvents.length); // Update total events count
      } else {
        setEvents([]);
        setTotalEvents(0);
      }
    }, (error) => {
      console.error(`Error fetching events: ${error.message}`);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Function to format date to "day, month year"
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  // Function to generate a random color from a predefined list
  const getRandomColor = () => {
    const colors = ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-red-400', 'bg-indigo-400'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
    <div className="space-y-4 p-4 m-2">
      <div className="">
        {events.length > 0 ? (
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.id} className="p-1 pt-2 pb-4 border-b">
                <button className={`text-sm ${getRandomColor()} p-2 mb-3 pl-6 pr-6 rounded-2xl text-white`}>{formatDate(event.date)}</button>
                <p className="text-base text-gray-700">{event.details}</p>
                <p className="text-sm text-gray-500">{event.postedBy}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events available.</p>
        )}
      </div>
    </div>
  );
};

export default EventsList;
