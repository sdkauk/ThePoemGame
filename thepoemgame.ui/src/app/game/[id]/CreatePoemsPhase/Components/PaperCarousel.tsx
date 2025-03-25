import React from "react";
import Carousel from "./Carousel";
import {
  BlankWhitePaper,
  BlueLined,
  YellowishPaper,
  BlackPaper,
  WatercolorPaper,
} from "./PaperStyles";

interface PaperCarouselProps {
  onSelectPaper?: (paperType: string) => void;
  initialPosition?: number;
}

const PaperCarousel: React.FC<PaperCarouselProps> = ({
  onSelectPaper,
  initialPosition = 0,
}) => {
  const papers = [
    { component: BlankWhitePaper, name: "clean-white" },
    { component: BlueLined, name: "blue-lined" },
    { component: YellowishPaper, name: "vintage" },
    { component: BlackPaper, name: "dark" },
    { component: WatercolorPaper, name: "watercolor" },
  ];

  return (
    <Carousel
      items={papers}
      onSelectPaper={onSelectPaper}
      initialPosition={initialPosition}
    />
  );
};

export default PaperCarousel;
