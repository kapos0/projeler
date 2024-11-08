import { BrowserRouter } from "react-router-dom";
import Pages from "./pages/Pages";
import Category from "./components/Category";
import Search from "./components/Search";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { GiKnifeFork } from "react-icons/gi";
import "./App.css";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <GiKnifeFork />
            <Logo to={"/"}>Lezzizoooo</Logo>
          </div>
          <div>
            <Menu to={"/menu"} className="buton">
              Menü
            </Menu>
            <Fav to={"/favorites"} className="buton">
              Favoriler
            </Fav>
            <Login to={"/loginregister"} className="buton">
              Hesabım
            </Login>
          </div>
        </Nav>
        <Search />
        <Category />
        <Pages />
      </BrowserRouter>
    </div>
  );
}

const Fav = styled(Link)`
  font-family: "Lobster Two", cursive;
`;

const Login = styled(Link)`
  font-family: "Lobster Two", cursive;
`;

const Menu = styled(Link)`
  font-family: "Lobster Two", cursive;
`;

const Logo = styled(Link)`
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 400;
  font-family: "Lobster Two", cursive;
`;

const Nav = styled.div`
  padding: 4rem 0rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  svg {
    font-size: 2rem;
  }
`;

export default App;
