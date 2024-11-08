import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("userLoggedIn"))?.username;
  const storageKey = user ? `userFavoriteRecipes_${user}` : "favoriteRecipes";

  async function getFavorites() {
    const recipes = JSON.parse(localStorage.getItem(storageKey)) || [];
    setFavorites(recipes);
  }

  useEffect(() => {
    getFavorites();
  }, []);

  function removeFromFavorites(id) {
    const updatedFavorites = favorites.filter((item) => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  }

  return (
    <Grid>
      {favorites.length <= 0 ? (
        <h1 style={{ textAlign: "center" }}>
          Favoriye eklenmiş tarif bulunmamaktadır!
        </h1>
      ) : (
        favorites.map((item) => {
          return (
            <Card key={item.id}>
              <RemoveButton onClick={() => removeFromFavorites(item.id)}>
                Favorilerden kaldır!
              </RemoveButton>
              <Link to={"/recipe/" + item.id}>
                <img src={item.image} alt={item.title} />
                <h4>{item.title}</h4>
              </Link>
            </Card>
          );
        })
      )}
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  grid-gap: 3rem;
`;

const Card = styled.div`
  position: relative;
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

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
`;

export default Favorites;
