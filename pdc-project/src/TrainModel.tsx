import {
  Card,
  CardBody,
  FormControl,
  Heading,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import "./TrainModel.css";

const Reveal = () => {
  const [numClient, setNumClient] = useState(0);
  const [state, setState] = useState(false);
  const models = [
    "Local_model0",
    "Local_model1",
    "Local_model2",
    "Local_model3",
    "Local_model4",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numClient < 1 || numClient > 10 || numClient == 0) {
      toast({
        position: "top",
        title: "Error!",
        description: "Number of Clients should be between 1 and 10",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setState(true);
  };

  useEffect(() => {
    if (state && currentIndex < models.length) {
      const timer = setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [state, currentIndex, models]);
  return (
    <>
      <div className="train_card">
        <div>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <Heading fontSize="2xl">Number of Clients</Heading>
              <NumberInput
                min={1}
                max={10}
                clampValueOnBlur={false}
                marginTop={4}
                width="300px"
                onChange={(value: string) => {
                  setNumClient(parseInt(value));
                }}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <button type="submit" className="train_button_description">
              Submit
            </button>
          </form>
        </div>
        <div>
          <Card maxW="sm" overflow="hidden" variant="outline" height="">
            <CardBody>
              <Stack>
                <Heading fontSize="2xl">Local Model Processing</Heading>
                <Text py="2">
                  {state &&
                    models
                      .slice(0, currentIndex)
                      .map((el, index) => <p key={index}>{el}</p>)}
                </Text>
              </Stack>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Reveal;
