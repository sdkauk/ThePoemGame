import React from "react";
import Carousel from "./Carousel";
import PoemDisplay from "@/components/PoemDisplay/PoemDisplay";

interface PaperCarouselProps {
  onSelectPaper?: (paperType: string) => void;
  initialPosition?: number;
}
const BluePaper = (props) => <PoemDisplay paperType="blue-lined" {...props} />;
const WhitePaper = (props) => (
  <PoemDisplay paperType="clean-white" {...props} />
);
const VintagePaper = (props) => <PoemDisplay paperType="vintage" {...props} />;
const DarkPaper = (props) => <PoemDisplay paperType="dark" {...props} />;
const WatercolorPaper = (props) => (
  <PoemDisplay paperType="watercolor" {...props} />
);

const PaperCarousel: React.FC<PaperCarouselProps> = ({
  onSelectPaper,
  initialPosition = 0,
}) => {
  const papers = [
    { component: WhitePaper, name: "clean-white" },
    { component: BluePaper, name: "blue-lined" },
    { component: VintagePaper, name: "vintage" },
    { component: DarkPaper, name: "dark" },
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
