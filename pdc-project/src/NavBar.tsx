import { HStack, Image, Spacer, Heading } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import ColorModeSwitch from "./ColorModeSwitch";
import logo from "./assets/logo.png";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <HStack padding="20px">
      <Link
        to="/"
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image src={logo} style={{ height: "59px", width: "70px" }} />
        <Heading as="h1" fontSize="3xl" marginLeft={6}>
          Distributed Segmentation
        </Heading>
      </Link>

      <Spacer />

      <div className="navbar">
        <ul className="nav">
          <li className="nav-item">
            <Link to="/" className="navigation_link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/Train-Model" className="navigation_link">
              Train Model
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/Image-Segmentation" className="navigation_link">
              Image Segmentation
            </Link>
          </li>
        </ul>
      </div>

      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;
