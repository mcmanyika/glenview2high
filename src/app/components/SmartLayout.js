import '../../app/globals.css';

const SmartLayout = ({children}) => {
  
  return (
    <section className="flex flex-col md:flex-row items-center justify-center text-center h-screen">
      <div className="flex-1 bg-slate-400 w-full h-full">&nbsp;</div>
      <div className="flex-1 p-8">
        {children}
      </div>
    </section>
  );
};

export default SmartLayout;
