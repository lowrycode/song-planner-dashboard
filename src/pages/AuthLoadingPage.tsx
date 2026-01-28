import Spinner from "../components/Spinner";

interface AuthLoadingPageProps {
  title: string;
  subTitle: string;
}

function AuthLoadingPage({title, subTitle}: AuthLoadingPageProps) {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Left image, hidden on mobile */}
      <div className="hidden md:block md:w-2/5">
        <img
          src="/images/worship.webp"
          alt="Corporate worship"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right form */}
      <div className="w-full md:w-3/5 bg-gray-50 relative">
        <img
          src="/images/ccn_logo_desat.png"
          alt="Corporate worship"
          className="w-2/7 absolute -right-1/20 -top-5 opacity-20"
        />
        <img
          src="/images/hymn_book_fade.png"
          alt="Corporate worship"
          className="h-1/2 w-full absolute -bottom-10 z-10 object-cover object-top"
        />
        <div className="relative text-center z-10 max-w-96 mx-auto px-6 mt-20">
          <h1 className="text-4xl font-bold text-purple-950 text-center mb-3">
            {title}
          </h1>
          <p className="text-sm text-gray-800 mb-10">{subTitle}</p>
          <Spinner message="" />
        </div>
      </div>
    </div>
  );
}

export default AuthLoadingPage;
