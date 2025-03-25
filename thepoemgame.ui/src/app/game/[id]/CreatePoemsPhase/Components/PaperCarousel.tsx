import React from "react";
import Carousel from "./Carousel";
import {
  BlankWhitePaper,
  BlueLined,
  YellowishPaper,
  GraphPaper,
  DottedPaper,
  BlackPaper,
  WatercolorPaper,
} from "./PaperStyles";

interface PaperCarouselProps {
  onSelectPaper?: (paperType: string) => void;
  initialPosition?: number;
}

const PaperCarousel: React.FC<PaperCarouselProps> = ({}) => {
  const papers = [
    { component: BlankWhitePaper, name: "clean-white" },
    { component: BlueLined, name: "blue-lined" },
    { component: YellowishPaper, name: "vintage" },
    { component: GraphPaper, name: "graph" },
    { component: DottedPaper, name: "dotted" },
    { component: BlackPaper, name: "dark" },
    { component: WatercolorPaper, name: "watercolor" },
  ];
  return <Carousel />;
};

export default PaperCarousel;
