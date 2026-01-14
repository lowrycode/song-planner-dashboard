import { Link } from "react-router-dom";

export default function RegisterSuccessPage() {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <div className="w-full bg-gray-50 relative">
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
        <div className="max-w-96 mx-auto px-6 mt-20">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-purple-950 text-center mb-3">
              Success
            </h1>
            <p className="text-gray-600 text-center text-sm mb-2">
              Thank you for registering!
            </p>
            <p className="text-gray-600 text-center text-sm italic mb-8">
              Your account requires approval from your network admin before you
              will be able to login.
            </p>
            <Link
              to="/login"
              className="bg-purple-900 text-gray-100 px-6 py-2 rounded-md text-center hover:bg-purple-700 hover:cursor-pointer"
            >
              Go to Login Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
