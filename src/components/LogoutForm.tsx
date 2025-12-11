function LogoutForm() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-purple-950 text-center mb-4">
        Logout
      </h1>
      <p className="text-gray-600 text-center text-sm mb-8">
        Are you sure you wush to logout?
      </p>
      <button className="bg-purple-900 text-gray-100 px-6 py-2 rounded-md text-center hover:bg-purple-700 hover:cursor-pointer">Logout</button>
    </div>
  );
}

export default LogoutForm;
