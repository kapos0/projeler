import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";

function Searched() {
  const [searchedRecipes, setSearchRecipes] = useState([]);
  let params = useParams();

  async function getSearched(name) {
    let titleOrIngredient = name.includes(",");
    let data;
    if (titleOrIngredient) {
      data = await fetch(
        `http://127.0.0.1:8000/findByIngredients?&number=9&ingredients=${name}`
      );
    } else {
      data = await fetch(`http://localhost:8000/search?number=3&title=${name}`);
    }
    const recipes = await data.json();
    setSearchRecipes(recipes);
  }

  useEffect(() => {
    getSearched(params.search);
  }, [params.search]);

  return (
    <Grid>
      {searchedRecipes.map((item) => {
        return (
          <Card key={item.id}>
            <Link to={"/recipe/" + item.id}>
              <img src={item.image} alt={item.title} />
              <h4>{item.title}</h4>
            </Link>
          </Card>
        );
      })}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  grid-gap: 3rem;
`;

const Card = styled.div`
  img {
    width: 100%;
    border-radius: 2rem;
  }
  a {
    text-decoration: none;
  }
  h4 {
    text-align: center;
    padding: 1rem;
  }
`;

export default Searched;
