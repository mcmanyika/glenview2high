

export default function Wave() {
  return (
    <div className="relative h-[50px] overflow-hidden">
      <div className="absolute -bottom-2 left-0 w-full overflow-hidden leading-none z-20">
        <svg
          className="relative block w-full h-[80px] transform scale-110"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            fillOpacity="1"
            d="M0,160L48,176C96,192,192,224,288,240C384,256,480,256,576,234.7C672,213,768,171,864,165.3C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
