// components/EventsCalendar.js
const EventsCalendar = () => {
    return (
      <section className="">
        <h2 className="text-2xl font-bold text-center">Upcoming Events</h2>
        <ul className="mt-4 space-y-4">
          <li className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-bold">School Sports Day</h3>
            <p>Date: July 20, 2024</p>
            <p>Join us for a day of fun and competition at the annual school sports day.</p>
          </li>
          <hr className="border-white w-52 mx-auto my-8" />

          <li className="p-4 rounded-lg">
            <h3 className="text-lg font-bold">Parent-Teacher Meeting</h3>
            <p>Date: August 15, 2024</p>
            <p>An opportunity for parents to meet with teachers and discuss student progress.</p>
          </li>
        </ul>
      </section>
    );
  };
  
  export default EventsCalendar;
  