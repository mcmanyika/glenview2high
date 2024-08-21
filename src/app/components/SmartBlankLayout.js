import '../../app/globals.css';

const SmartBlankLayout = ({ children }) => {
  return (
    <section className="flex items-center justify-center h-screen text-center">
      <div className="p-8 w-full max-w-3xl mx-auto">
        {children}
      </div>
    </section>
  );
};

export default SmartBlankLayout;
