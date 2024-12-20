import { useEffect, useState } from "react";
import styled from "styled-components";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { Link } from "react-router-dom";

function Veggie() {
	const [veggies, setVeggies] = useState([]);

	useEffect(() => {
		getVeggies();
	}, []);

	async function getVeggies() {
		const check = sessionStorage.getItem("veggies");
		if (check) {
			setVeggies(JSON.parse(check));
		} else {
			const api = await fetch(
				`http://127.0.0.1:8000/random?number=99&tags=vegetarian`
			);
			const data = await api.json();
			sessionStorage.setItem("veggies", JSON.stringify(data.recipes));
			setVeggies(data.recipes);
		}
	}

	return (
		<div>
			<Wrapper>
				<h3>Vejeteryan Seçimler</h3>
				<Splide
					options={{
						perPage: 3,
						arrows: false,
						pagination: false,
						drag: "free",
						gap: "3rem",
					}}>
					{veggies.map(recipe => {
						return (
							<SplideSlide key={recipe.id}>
								<Card>
									<Link to={"/recipe/" + recipe.id}>
										<p>{recipe.title}</p>
										<img
											src={recipe.image}
											alt={recipe.title}
										/>
										<Gradient />
									</Link>
								</Card>
							</SplideSlide>
						);
					})}
				</Splide>
			</Wrapper>
		</div>
	);
}

const Wrapper = styled.div`
	margin: 4rem 0rem;
`;

const Card = styled.div`
	min-height: 25rem;
	border-radius: 2rem;
	overflow: hidden;
	position: relative;

	img {
		border-radius: 2rem;
		position: absolute;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	p {
		position: absolute;
		z-index: 10;
		left: 50%;
		bottom: 0;
		transform: translate(-50%, 0%);
		color: white;
		width: 100%;
		text-align: center;
		font-weight: 600;
		font-size: 1rem;
		height: 40%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
`;

const Gradient = styled.div`
	z-index: 3;
	position: absolute;
	width: 100%;
	height: 100%;
	background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
`;

export default Veggie;
