import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Recipe() {
  let params = useParams({});
  const [details, setDetails] = useState({});
  const [activeTab, setActiveTab] = useState("instructions");
  const [alreadyExists, setAlreadyExists] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("userLoggedIn"))?.username;
  const [isAddedToMenu, setIsAddedToMenu] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  async function fetchDetails() {
    try {
      const data = await fetch(
        `http://127.0.0.1:8000/${params.name}/information`
      );
      const detailData = await data.json();
      setDetails(detailData);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  }

  useEffect(() => {
    fetchDetails();
  }, [params.name]);

  useEffect(() => {
    const breakfastMenu =
      JSON.parse(sessionStorage.getItem("breakfastMenu")) || [];
    const lunchMenu = JSON.parse(sessionStorage.getItem("lunchMenu")) || [];
    const dinnerMenu = JSON.parse(sessionStorage.getItem("dinnerMenu")) || [];

    const isAdded = {
      breakfast: breakfastMenu.some((item) => item.id === details.id),
      lunch: lunchMenu.some((item) => item.id === details.id),
      dinner: dinnerMenu.some((item) => item.id === details.id),
    };

    setIsAddedToMenu(isAdded);
  }, [details]);

  function addFavorite(e) {
    e.preventDefault();
    const storageKey = user ? `userFavoriteRecipes_${user}` : "favoriteRecipes";
    const favoritesFromStorage =
      JSON.parse(localStorage.getItem(storageKey)) || [];

    const favoriteRecipe = {
      id: details.id,
      title: details.title,
      image: details.image,
      summary: details.summary,
      instructions: details.instructions,
      ingredients: details.extendedIngredients,
    };

    const alreadyExists = favoritesFromStorage.some(
      (recipe) => recipe.id === favoriteRecipe.id
    );

    if (!alreadyExists) {
      favoritesFromStorage.push(favoriteRecipe);
      localStorage.setItem(storageKey, JSON.stringify(favoritesFromStorage));
    }

    setAlreadyExists(alreadyExists);
    alert("Favorilere eklendi");
  }

  function addToMenu(menuType) {
    const storageKey = `${menuType}Menu`;
    const menuItems = JSON.parse(sessionStorage.getItem(storageKey)) || [];
    const menuItem = {
      id: details.id,
      title: details.title,
      image: details.image,
      summary: details.summary,
      instructions: details.instructions,
      ingredients: details.extendedIngredients,
    };
    menuItems.push(menuItem);
    sessionStorage.setItem(storageKey, JSON.stringify(menuItems));
    alert("Menüye eklendi");
    setDetails((prevDetails) => ({ ...prevDetails }));
  }

  return (
    <DetailWrapper>
      <div>
        <h2>{details.title}</h2>
        <img src={details.image} alt={details.title} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <Button className="button" onClick={addFavorite}>
            {!alreadyExists ? "Favoriye Ekle!" : "Zaten favorilerde!"}
          </Button>
        </div>
        <div
          className="btn-group"
          role="group"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => addToMenu("breakfast")}
            disabled={isAddedToMenu.breakfast}
          >
            Kahvaltıya ekle
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => addToMenu("lunch")}
            disabled={isAddedToMenu.lunch}
          >
            Öğle yemeğine ekle
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => addToMenu("dinner")}
            disabled={isAddedToMenu.dinner}
          >
            Akşam yemeğine ekle
          </button>
        </div>
      </div>
      <Info>
        <Button
          className={activeTab === "instructions" ? "active" : ""}
          onClick={() => setActiveTab("instructions")}
        >
          Yemek hakkında
        </Button>
        <Button
          className={activeTab === "ingredients" ? "active" : ""}
          onClick={() => setActiveTab("ingredients")}
        >
          Malzemeler
        </Button>
        {activeTab === "instructions" && (
          <div>
            <h3
              style={{ fontWeight: "normal" }}
              dangerouslySetInnerHTML={{ __html: details.summary }}
            />
            <p dangerouslySetInnerHTML={{ __html: details.instructions }} />
          </div>
        )}
        {activeTab === "ingredients" && (
          <ul>
            {details.extendedIngredients &&
              details.extendedIngredients.map((ingredient) => (
                <li key={ingredient.id}>{ingredient.original}</li>
              ))}
          </ul>
        )}
      </Info>
    </DetailWrapper>
  );
}

const DetailWrapper = styled.div`
  margin-top: 10rem;
  margin-bottom: 5rem;
  display: flex;
  .active {
    background: linear-gradient(35deg, #494949, #313131);
    color: white;
  }
  h2 {
    margin-bottom: 2rem;
  }
  li {
    font-size: 1.2rem;
    line-height: 2.5rem;
  }
  ul {
    margin-top: 2rem;
  }
  img {
    width: 700px;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  color: #313131;
  background: white;
  border: 2px solid black;
  margin-right: 2rem;
  font-weight: 600;
`;

const Info = styled.div`
  margin-left: 10rem;
`;

export default Recipe;
