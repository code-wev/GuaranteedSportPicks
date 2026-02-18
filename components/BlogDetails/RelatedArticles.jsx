import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const articles = [
  {
    tag: "NHL Coverage",
    date: "November 12, 2025",
    read: "5 min read",
    title: "NHL Stanley Cup Odds Update: Dark Horse Teams to Watch",
    desc: "While the usual suspects lead the Stanley Cup odds, several dark horse teams are making compelling cases. We identify the sleeper picks worth backing.",
    author: "Jennifer Walsh",
    img: "/blogDetails/related1.png",
  },
  {
    tag: "Industry News",
    date: "November 12, 2025",
    read: "5 min read",
    title: "Sports Betting Regulation Update: New State Laws and Their Impact",
    desc: "Recent changes in sports betting legislation across multiple states are reshaping the industry landscape. Here’s what you need to know about the new regulations.",
    author: "Lisa Johnson",
    img: "/blogDetails/related2.png",
  },
  {
    tag: "NHL Coverage",
    date: "November 12, 2025",
    read: "5 min read",
    title: "NHL Stanley Cup Odds Update: Dark Horse Teams to Watch",
    desc: "While the usual suspects lead the Stanley Cup odds, several dark horse teams are making compelling cases. We identify the sleeper picks worth backing.",
    author: "Jennifer Walsh",
    img: "/blogDetails/related3.png",
  },
];

const RelatedArticles = () => {
  return (
    <section className="py-16 bg-[#f9fafb]">
      {/* TITLE */}
      <h2 className="text-center text-4xl font-semibold text-gray-900 mb-10">
        Related Articles
      </h2>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 max-w-6xl mx-auto">
        {articles.map((article, index) => (
          <div
            key={index}
            className="rounded-xl  hover:shadow-lg transition duration-300"
          >
            {/* IMAGE */}
            <div className="relative w-full h-56">
              <Image
                src={article.img}
                alt={article.title}
                fill
                className="object-cover rounded-t-2xl"
                priority
              />
            </div>

            {/* CONTENT */}
            <div className="p-3 md:w-[350px] bg-white shadow-2xl rounded-b-2xl">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span className="bg-[#B91C1C] text-white px-2 py-1 rounded-md text-xs">
                  {article.tag}
                </span>
                <p className=" text-xs flex items-center gap-1 text-gray-500">
                  <GoDotFill className="" />
                  November 12, 2025
                </p>
                <p className="text-xs flex items-center gap-1 text-gray-500">
                  <GoDotFill className="" />5 min read
                </p>
              </div>

              <h3 className=" font-semibold text-gray-900 my-2 leading-tight">
                {article.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4">{article.desc}</p>

              <p className="text-gray-900 text-sm font-medium">
                By {article.author}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <div className="text-center mt-10">
        <button className="bg-[#B91C1C] text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto hover:bg-red-700 transition">
          View All Articles
          <FaArrowRight size={14} />
        </button>
      </div>
    </section>
  );
};

export default RelatedArticles;
