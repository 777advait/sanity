"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";
import NewsItem from "./NewsItem";
import { PacmanLoader } from "react-spinners";

const News = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [esportsNews, setEsportsNews] = useState([]);
  const [gamingNews, setGamingNews] = useState([]);
  const [tournamentNews, setTournamentNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

  useEffect(() => {
    const fetchNews = async (category, setter) => {
      try {
        setIsLoading(true); // Start loading
        const response = await axios.get(
          `https://gnews.io/api/v4/search?q=${category}&lang=en&country=us&max=10&apikey=81a4b76d35bd5ea98535a29f90daa9fa`,
        );

        // Check if response is successful
        if (response.status === 200) {
          const articlesWithImages = response.data.articles.filter(
            (article) => article.image,
          );
          setter(articlesWithImages);
        } else {
          console.error(`Error fetching ${category} news: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error fetching ${category} news:`, error);
      } finally {
        setIsLoading(false); // Always stop loading, regardless of success or error
      }
    };

    fetchNews("Gaming", setLatestNews);
    fetchNews("Esports", setEsportsNews);
    fetchNews("Gaming News", setGamingNews);
  }, []);

  const sliderRefs = {
    latestNews: useRef(null),
    esportsNews: useRef(null),
    gamingNews: useRef(null),
    tournamentNews: useRef(null),
  };

  const scroll = (category, direction) => {
    const slider = sliderRefs[category].current;
    if (slider) {
      const scrollAmount = direction === "left" ? -300 : 300;
      slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  const renderNewsSlider = (title, articles, category) => (
    <div className="mb-16 mt-2 h-fit">
      {/* Title Section */}
      <div className="uppercase text-white text-center text-2xl md:text-3xl h-fit font-semibold flex justify-center items-center">
        {title}
      </div>

      {/* Content Section */}
      <div className="w-full flex justify-center mt-4 h-fit">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <PacmanLoader color="white" />
          </div>
        ) : (
          <div
            ref={sliderRefs[category]}
            className="grid grid-cols-1 p-2 m-2 md:grid-cols-2 md:p-1 md:m-1 w-full max-w-6xl"
          >
            {articles.map((article, index) => (
              <div
                key={index}
                className="flex flex-col justify-between rounded-lg border border-gray-700 shadow-md bg-gray-800 my-10 mx-5"
              >
                <div className="w-full h-fit">
                  <NewsItem
                    title={article.title}
                    description={article.description}
                    url={article.url}
                    urlToImage={article.image}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container px-2 h-fit">
      {renderNewsSlider("Latest News", latestNews, "latestNews")}
      {renderNewsSlider("Esports", esportsNews, "esportsNews")}
      {renderNewsSlider("Gaming News", gamingNews, "gamingNews")}
    </div>
  );
};

export default News;
