import LogoutForm from "../components/LogoutForm";

function LogoutPage() {
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
            <LogoutForm />
        </div>
      </div>

    </div>
  );
}

export default LogoutPage;
