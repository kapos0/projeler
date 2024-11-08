import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Menu() {
  const [breakfastMenu, setBreakfastMenu] = useState([]);
  const [lunchMenu, setLunchMenu] = useState([]);
  const [dinnerMenu, setDinnerMenu] = useState([]);

  useEffect(() => {
    const breakfastMenuItems =
      JSON.parse(sessionStorage.getItem("breakfastMenu")) || [];
    const lunchMenuItems =
      JSON.parse(sessionStorage.getItem("lunchMenu")) || [];
    const dinnerMenuItems =
      JSON.parse(sessionStorage.getItem("dinnerMenu")) || [];

    setBreakfastMenu(breakfastMenuItems);
    setLunchMenu(lunchMenuItems);
    setDinnerMenu(dinnerMenuItems);
  }, []);

  function removeMenuItem(type, index) {
    let updatedMenuItems;

    switch (type) {
      case "breakfast":
        updatedMenuItems = [...breakfastMenu];
        updatedMenuItems.splice(index, 1);
        setBreakfastMenu(updatedMenuItems);
        break;
      case "lunch":
        updatedMenuItems = [...lunchMenu];
        updatedMenuItems.splice(index, 1);
        setLunchMenu(updatedMenuItems);
        break;
      case "dinner":
        updatedMenuItems = [...dinnerMenu];
        updatedMenuItems.splice(index, 1);
        setDinnerMenu(updatedMenuItems);
        break;
      default:
        break;
    }

    sessionStorage.setItem(`${type}Menu`, JSON.stringify(updatedMenuItems));
  }

  return (
    <div className="container">
      <h1 className="mt-5 mb-4 text-primary">Menü</h1>
      <h2>Kahvaltı</h2>
      <ul className="list-group">
        {breakfastMenu.map((item, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {item.title}
            <div>
              <Link
                to={`/recipe/${item.id}`}
                className="btn btn-secondary mr-2"
                style={{ marginRight: "1rem" }}
              >
                Tarife git
              </Link>
              <button
                className="btn btn-danger"
                onClick={() => removeMenuItem("breakfast", index)}
              >
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h2>Öğle yemeği</h2>
      <ul className="list-group">
        {lunchMenu.map((item, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {item.title}
            <div>
              <Link
                to={`/recipe/${item.id}`}
                className="btn btn-secondary mr-2"
                style={{ marginRight: "1rem" }}
              >
                Tarife git
              </Link>
              <button
                className="btn btn-danger"
                onClick={() => removeMenuItem("lunch", index)}
              >
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h2>Akşam yemeği</h2>
      <ul className="list-group">
        {dinnerMenu.map((item, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {item.title}
            <div>
              <Link
                to={`/recipe/${item.id}`}
                className="btn btn-secondary mr-2"
                style={{ marginRight: "1rem" }}
              >
                Tarife git
              </Link>
              <button
                className="btn btn-danger"
                onClick={() => removeMenuItem("dinner", index)}
              >
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
