import { useState } from "react";
import {
  Card,
  CardBody,
  Divider,
  Heading,
  Stack,
  useToast,
  Image,
  Text,
  Spinner,
} from "@chakra-ui/react";
import "./ImageSegmentation.css";
import axios from "axios";
import noImg from "./assets/NoImg.jpg";
import ResImg from "./assets/img.jpg";

const Conceal = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [resImg, setResImg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const convertImageToBase64 = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!selectedImage) {
      toast({
        position: "top",
        title: "Error!",
        description: "Please select an image",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // const cover_img = await convertImageToBase64(selectedImage);

    setTimeout(() => {
      setResImg(ResImg);
      setIsLoading(false);
    }, 3000);

    return;
    try {
      const body = {
        cover_img,
      };
      const headers = {
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        "http://127.0.0.1:5000/segmentation",
        body,
        { headers }
      );
    } catch (error) {
      console.error("Error processing images:", error);
      toast({
        position: "top",
        title: "Error!",
        description: "Error in processing image. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    console.log(file);
    setSelectedImage(file);
  };

  return (
    <>
      <div className="segment_cards">
        <Card maxW="md" overflow="hidden" variant="outline">
          <CardBody>
            <Image
              style={{
                objectFit: "cover",
                height: "300px",
                width: "415px",
              }}
              src={selectedImage ? URL.createObjectURL(selectedImage) : noImg}
            />
            <Stack>
              <Heading fontSize="3xl" style={{ marginTop: "15px" }}>
                Input Image
              </Heading>
              <Text>
                This image will be visible for everyone. It's container for your
                secret message
              </Text>

              <form>
                <Divider />
                <label>
                  <Heading fontSize="xl">Select an image</Heading>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                    style={{ marginTop: "10px" }}
                  />
                </label>
              </form>
            </Stack>
          </CardBody>
        </Card>
        {isLoading && <Spinner />}

        <Card maxW="md" overflow="hidden" variant="outline">
          <CardBody>
            <Image
              style={{
                objectFit: "cover",
                height: "300px",
                width: "415px",
              }}
              src={resImg ? resImg : noImg}
            />
            <Stack>
              <Heading fontSize="3xl" style={{ marginTop: "15px" }}>
                Segmented image
              </Heading>
              <Text>
                This image will be visible for everyone. It's container for your
                secret message
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </div>

      <form onSubmit={handleSubmit} className="segment_submit_form">
        <input
          type="submit"
          className="segment_button_description"
          value="Submit"
        />
      </form>
    </>
  );
};

export default Conceal;
