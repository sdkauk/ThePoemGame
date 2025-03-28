import React, { useState } from "react";
import Container from "@/components/Container/container";
import GroupsSection from "./components/Groups/GroupsSection/GroupsSection";
import PoemsSection from "./components/Poems/PoemsSection/PoemsSection";
import GamesSection from "./components/Games/GamesSection/GamesSection";
import Grid from "@/components/Grid/grid";
import Column from "@/components/Column/column";
import PoemDisplay from "@/components/PoemDisplay/PoemDisplay";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(
    undefined
  );

  const handleViewGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  return (
    <div>
      <Container maxWidth="xl" padding>
        <Grid cols={1} gap="lg">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <GroupsSection onViewGroup={handleViewGroup} />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <Grid cols={1} gap="lg">
                {/* <PoemsSection /> */}
                <GamesSection user={user} />
              </Grid>
            </div>
          </div>
        </Grid>
      </Container>
    </div>
  );
}
