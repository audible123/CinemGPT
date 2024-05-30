import React from "react";
import GptSearchBar from "./GptSearchBar";
import GptContant from "./GptContant";
import bgImage from "../../assets/bg.jpg";

const GptContainer = () => {
	return (
		<div>
			<div className="min-h-screen w-full h-full absolute top-0">
				<img
					className="w-full min-h-screen object-cover object-left-top fixed top-0"
					src={bgImage}
					alt="bgImg"
				/>
			</div>
			<div className="relative z-10">
				<GptSearchBar />
				<GptContant />
			</div>
		</div>
	);
};

export default GptContainer;
