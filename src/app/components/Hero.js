const Hero = () => {
  return (
    <div className="relative h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90 "
        style={{ backgroundImage: "url('images/2.png')" }}
      ></div>
      <section className="relative text-white p-10 md:p-20 text-center">
        <h1 className="text-3xl md:text-7xl font-thin font-sans">Welcome to Our School</h1>
        <p className="mt-4 text-base md:text-thin">Empowering students to reach their full potential.</p>
      </section>
    </div>
  );
};

export default Hero;
