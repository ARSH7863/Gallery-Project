import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [userData, setUserData] = useState([]);
  const [search, setSearch] = useState("");
  const [index, setIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const getData = async () => {
    setLoading(true);
    const response = await axios.get(
      `https://picsum.photos/v2/list?page=${index}&limit=14`
    );
    setUserData((prev) => [...prev, ...response.data]);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [index]);

  // Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.scrollHeight - 200 &&
        !loading
      ) {
        setIndex((prev) => prev + 1);
      }
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredImages = userData.filter((img) =>
    img.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white pb-10">
      {/* FIXED HEADER */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#0f0f0f]/90 backdrop-blur-md shadow-md border-b border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-4 gap-3 max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-400">
            📸 Masonry Gallery
          </h1>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by author..."
            className="px-5 py-2 w-full sm:w-72 rounded-lg border border-gray-700 bg-black text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-all duration-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Padding to avoid overlap */}
      <div className="pt-28 px-4">
        {/* MASONRY GRID */}
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 space-y-4">
          {filteredImages.length > 0 ? (
            filteredImages.map((img, idx) => (
              <a
                key={idx}
                href={img.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group relative overflow-hidden rounded-xl"
              >
                <img
                  src={img.download_url}
                  alt={img.author}
                  className="w-full rounded-xl mb-4 hover:opacity-80 transition-all duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-transparent p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-sm text-gray-200 font-semibold">
                    {img.author}
                  </p>
                </div>
              </a>
            ))
          ) : (
            <p className="text-center text-gray-400 text-lg py-20">
              {loading ? "Loading..." : "No images found 😢"}
            </p>
          )}
        </div>

        {/* LOADER */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-amber-400 font-semibold">
              Loading more...
            </span>
          </div>
        )}
      </div>

      {/* BACK TO TOP BUTTON */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-amber-400 to-yellow-500 
          hover:from-yellow-400 hover:to-amber-300 text-black font-bold p-4 rounded-full 
          shadow-[0_0_15px_rgba(255,200,0,0.6)] hover:shadow-[0_0_25px_rgba(255,220,0,0.9)] 
          transition-all duration-300 animate-fade-in-up hover:scale-110"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default App;
