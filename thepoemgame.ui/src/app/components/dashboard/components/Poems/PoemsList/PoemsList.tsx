// Update PoemsList.tsx to include both poem and game navigation
import React from "react";
import { WaitingPoem } from "@/services/poemService";
import Button from "@/components/Button/Button";
import { useRouter } from "next/navigation";

interface PoemsListProps {
  poems: WaitingPoem[];
}

const PoemsList: React.FC<PoemsListProps> = ({ poems }) => {
  const router = useRouter();

  const handleViewPoem = (poemId: string) => {
    router.push(`/poems/${poemId}`);
  };

  const handleViewGame = (gameId: string) => {
    router.push(`/games/${gameId}`);
  };

  return (
    <div className="space-y-4">
      {poems.map((poem) => (
        <div key={poem.poemId} className="border rounded-md p-4 bg-white">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold text-lg">{poem.title}</h3>
              <p className="text-sm text-gray-600">
                Started by {poem.author.name} • {poem.lineCount} lines
              </p>
              <p className="text-sm text-gray-500 mt-1">
                From game:{" "}
                <span
                  className="text-purple-600 cursor-pointer hover:underline"
                  onClick={() => handleViewGame(poem.gameId)}
                >
                  {poem.gameName || "Unknown Game"}
                </span>
              </p>
            </div>
            <div className="flex items-start">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleViewPoem(poem.poemId)}
              >
                Contribute
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PoemsList;
