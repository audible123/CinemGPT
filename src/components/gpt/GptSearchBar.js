import React, { useRef } from "react";
import lang from "../../utils/constants/langConstants";
import { useDispatch, useSelector } from "react-redux";
// import openai from "../../utils/openai";
import { GEMINI_KEY, MOVIES_OPTIONS } from "../../utils/constants/constants";
import {
	setGptMoviesSearch,
	setGptSearchBtnClicked,
} from "../../utils/slices/gptSlice";
import { GoogleGenerativeAI } from "@google/generative-ai";


const GptSearchBar = () => {
	const langCode = useSelector((store) => store.config.lang);
	const searchText = useRef(null);
	const dispatch = useDispatch();

	const genAI = new GoogleGenerativeAI(GEMINI_KEY);

	const handletmdbMoviesSearch = async (movie) => {
		try {
			const data = await fetch(
				`https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=1`,
				MOVIES_OPTIONS
			);
			const movies = await data.json();
			return movies.results;
		} catch (err) {
			console.error(err);
		}
	};

	const handleGptMoviesSearch = async () => {
		try {
			dispatch(setGptSearchBtnClicked());
			dispatch(
				setGptMoviesSearch({
					gptSearchNames: null,
					gptSearchMovies: null,
				})
			);

			const model = genAI.getGenerativeModel({ model: "gemini-pro"});
			const query =
				"Act as a Movie Recommendation system and suggest some movies for the query : " +
				searchText.current.value +
				". only give me names of 5 movies, comma seperated like the example result given ahead. Example is : Koi mil gya, Hera feri, Kabhi kushi kabhi gam, Dilwale, Dune";
			
			const result = await model.generateContent(query);
			const gptResults = await result.response;
			const gptMovies=gptResults.candidates?.[0]?.content?.parts?.[0]?.text.split(",");
			const promisesMovies = gptMovies.map((movie) =>
				handletmdbMoviesSearch(movie)
			);
			const tmdbMoviesSearch = await Promise.all(promisesMovies);
			dispatch(
				setGptMoviesSearch({
					gptSearchNames: gptMovies,
					gptSearchMovies: tmdbMoviesSearch,
				})
			);
		} catch (err) {
			console.error("Please try again in 20s.");
			alert("Please try again in 20s.");
		}
	};
	return (
		<>
			<div className="h-28 sm:h-32 md:h-40"></div>
			<div className=" flex justify-center sticky  top-[70px] md:top-20 z-30 px-2 sm:p-0">
				<form
					className="grid grid-cols-12 w-full sm:w-[70%] md:w-[50%] bg-black/60 p-3 rounded-full font-normal text-base sm:text-lg"
					onSubmit={(e) => e.preventDefault()}
				>
					<input
						ref={searchText}
						className="col-span-9 px-6 py-2 rounded-s-full text-center text-black outline-none"
						type="text"
						placeholder={lang[langCode].placeholder}
					/>
					<button
						className="col-span-3 rounded-r-full bg-blue-700 hover:border-blue-800 active:bg-blue-900 outline-none"
						onClick={() => handleGptMoviesSearch()}
					>
						{lang[langCode].search}
					</button>
				</form>
			</div>
		</>
	);
};

export default GptSearchBar;