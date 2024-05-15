import { Card, CardBody, Heading, Stack, Text, Image } from "@chakra-ui/react";
import homeImg from "./assets/home.jpg";
import "./Home.css";
import { FaChevronCircleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      marginLeft="30px"
      marginRight="30px"
    >
      <Image objectFit="cover" src={homeImg} className="img" />

      <Stack>
        <CardBody padding="30px">
          <Heading as="h1" fontSize="4xl">
            Empowering{" "}
            <span className="span">Distributed Image Segmentation</span>{" "}
            Effortlessly!
          </Heading>

          <Text className="text">
            <br />
            Unleash distributed image segmentation's potential. Seamlessly
            divide images across networks. Revolutionize collaborative image
            analysis. Welcome to the future of image segmentation and training
            of ML models in Distributed Enviroment.
          </Text>
          <div className="home_buttons">
            <button
              className="home_button_description"
              onClick={() => navigate("/Train-Model")}
            >
              Train Model <FaChevronCircleRight />
            </button>
            <button
              className="home_button_description"
              onClick={() => navigate("/Image-Segmentation")}
            >
              Test Model <FaChevronCircleRight />
            </button>
          </div>
        </CardBody>
      </Stack>
    </Card>
  );
};

export default Home;
