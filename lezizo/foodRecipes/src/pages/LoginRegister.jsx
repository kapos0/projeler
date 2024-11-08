import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState("");

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("userLoggedIn");
    if (loggedInUser) {
      const { username } = JSON.parse(loggedInUser);
      setIsLoggedIn(true);
      setLoggedInUsername(username);
    }
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem("userLoggedIn", JSON.stringify({ username }));
    setIsLoggedIn(true);
    setLoggedInUsername(username);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userLoggedIn");
    setIsLoggedIn(false);
    setLoggedInUsername("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoginPage) {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const matchingUser = storedUsers.find(
        (user) => user.username === username && user.password === password
      );

      if (matchingUser) {
        handleLogin();
      } else {
        alert("Hatalı giriş bilgileri");
      }
    } else {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = storedUsers.find(
        (user) => user.username === username
      );

      if (existingUser) {
        alert("Kullanıcı adı zaten mevcut");
      } else {
        const newUsers = [...storedUsers, { username, password }];
        localStorage.setItem("users", JSON.stringify(newUsers));
      }
    }

    setUsername("");
    setPassword("");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          {!isLoggedIn ? (
            <>
              <h2 className="mb-3">{isLoginPage ? "Giriş Yap" : "Kayıt Ol"}</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicUsername">
                  <Form.Label>Kullanıcı Adı</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Kullanıcı adınızı girin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Şifrenizi girin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-2">
                  {isLoginPage ? "Giriş Yap" : "Kayıt Ol"}
                </Button>
              </Form>

              <p className="mt-3">
                {isLoginPage
                  ? "Hesabınız yok mu? "
                  : "Zaten bir hesabınız var mı? "}
                <span
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsLoginPage(!isLoginPage)}
                >
                  {isLoginPage ? "Kayıt Ol" : "Giriş Yap"}
                </span>
              </p>
            </>
          ) : (
            <div style={{ display: "flex", flexFlow: "column" }}>
              <p style={{ textAlign: "center" }}>
                Giriş yaptınız, {loggedInUsername}!
              </p>
              <Button variant="danger" onClick={handleLogout}>
                Çıkış Yap
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default LoginRegister;
