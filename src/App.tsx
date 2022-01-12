import React, { FC, ReactElement, useState, useEffect } from "react";
import { format, sub } from "date-fns";
import { Button, ButtonGroup, H1, Label, Spinner } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { DiGithubAlt } from "react-icons/di";
import { Repository } from "./types";
import { RepoCard } from "./components/RepoCard";
import {
  Wrapper,
  Header,
  SpaceBetween,
  StyledNotIdealState,
} from "./components/Layout";

const App: FC = (): ReactElement => {
  const [isLoading, setIsLoading] = useState(true);
  const [repos, setRepos] = useState<Repository[] | undefined>();
  const [favourites, setFavourites] = useState<number[]>(
    JSON.parse(localStorage.getItem("favourites") || "[]")
  );
  const [showFavourites, setShowFavourites] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      const weekAgo = format(sub(new Date(), { days: 7 }), "yyyy-MM-dd");
      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=created:%3E${weekAgo}&sort=stars&order=desc`
        );
        const result = await response.json();
        if (result.items?.length) {
          setRepos(result.items);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchRepos();
  }, []);

  // Add the repo as a favourite, or remove if it's already a favourite.
  const handleFavouriteClick = (id: number) =>
    setFavourites((faves) => {
      const nextFaves = faves.includes(id)
        ? faves.filter((fID) => fID !== id)
        : [...faves, id];
      localStorage.setItem("favourites", JSON.stringify(nextFaves));
      return nextFaves;
    });

  return (
    <Wrapper>
      <SpaceBetween>
        <Header>
          <DiGithubAlt size={70} />
          <H1>Trending Repos</H1>
        </Header>
        <Label>
          Show{" "}
          <ButtonGroup>
            <Button
              active={!showFavourites}
              onClick={() => setShowFavourites(false)}
            >
              All
            </Button>
            <Button
              active={showFavourites}
              onClick={() => setShowFavourites(true)}
            >
              Favourites
            </Button>
          </ButtonGroup>
        </Label>
      </SpaceBetween>

      {isLoading && <Spinner />}

      {repos && (
        <>
          {repos
            // I would use a reduce here if there were performance considerations
            // but this reads better.
            .filter(({ id }) => !showFavourites || favourites.includes(id))
            .map((repo) => (
              <RepoCard
                key={repo.id}
                {...repo}
                isFavourite={favourites.includes(repo.id)}
                onClick={handleFavouriteClick}
              />
            ))}

          {repos && showFavourites && !favourites.length && (
            <StyledNotIdealState
              title="No favourites added yet, go add some!"
              icon="heart-broken"
            />
          )}
        </>
      )}

      {!repos && !isLoading && (
        <StyledNotIdealState title="No results from Github" icon="error" />
      )}
    </Wrapper>
  );
};

export default App;
