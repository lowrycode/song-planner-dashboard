const serviceNames = ["Hessle", "Network", "Newland", "Orchard Park", "Riverside"]

function HeaderOverview() {
  return (
    <form className="flex flex-col md:flex-row justify-between items-center gap-x-5 gap-y-2 my-2 mx-4 ">
      <div className="flex flex-1 justify-between bg-gray-900 text-gray-50 py-2 px-4 rounded-lg shadow-md flex-wrap gap-x-5 gap-y-2">
        <div className="flex gap-x-5 gap-y-1">
          <div className="flex gap-x-3 justify-end items-center">
            <label htmlFor="from">From</label>
            <input
              type="date"
              name="from"
              id="from"
              className="bg-gray-50 text-gray-500 px-2 py-1 rounded-md text-sm"
            />
          </div>
          <div className="flex gap-x-3 justify-end items-center">
            <label htmlFor="to">To</label>
            <input
              type="date"
              name="to"
              id="to"
              className="bg-gray-50 text-gray-500 px-2 py-1 rounded-md text-sm"
            />
          </div>
        </div>
        <div className="flex gap-x-5 flex-wrap">
          {serviceNames.map((s, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-purple-500"
                />
                {s as string}
              </label>
            ))}
        </div>
      </div>
      <button
        type="submit"
        className="bg-purple-900 rounded-lg text-gray-100 px-4 py-2 shadow-md hover:bg-purple-700 hover:cursor-pointer"
      >
        Update
      </button>
    </form>
  );
}

export default HeaderOverview;
