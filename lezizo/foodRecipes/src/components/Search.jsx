import { useState } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Search() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();
    navigate("/searched/" + input.toLowerCase());
  }

  return (
    <FormStyle onSubmit={submitHandler}>
      <input
        onChange={(e) => setInput(e.target.value)}
        type="text"
        value={input}
      />
      <FaSearch />
      <p style={{ textAlign: "center", margin: "1rem" }}>
        İçeriğe göre aramak için malzemeler arasına virgül ekleyiniz
      </p>
    </FormStyle>
  );
}

const FormStyle = styled.form`
  position: relative;
  div {
    width: 100%;
    position: relative;
  }
  input {
    border: none;
    background: linear-gradient(35deg, #494949, #313131);
    font-size: 1.5rem;
    color: white;
    padding: 1rem 3rem;
    border: none;
    border-radius: 1rem;
    outline: none;
    padding: 1rem;
    width: 100%;
  }
  svg {
    position: absolute;
    top: 32%;
    transform: translateY(-50%);
    color: white;
    right: 2%;
  }
`;

export default Search;
