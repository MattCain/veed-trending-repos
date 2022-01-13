import { FC, ReactElement, useState, useEffect, useRef } from "react";
import { format, sub } from "date-fns";
import { DiGithubAlt } from "react-icons/di";
import {
  Button,
  ButtonGroup,
  H1,
  HTMLSelect,
  Label,
  Spinner,
} from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { Repository } from "./types";
import { RepoCard } from "./components/RepoCard";
import {
  Wrapper,
  Header,
  SpaceBetween,
  StyledNotIdealState,
} from "./components/Layout";

const availableLanguages = [
  "Javascript",
  "Typescript",
  "Go",
  "C",
  "C++",
  "Rust",
];

const App: FC = (): ReactElement => {
  const [isLoading, setIsLoading] = useState(true);
  const [repos, setRepos] = useState<Repository[] | undefined>();
  const [favourites, setFavourites] = useState<Repository[]>(
    JSON.parse(localStorage.getItem("favourites") || "[]")
  );
  const [showFavourites, setShowFavourites] = useState(false);
  const [languageFilter, setLanguageFilter] = useState<string>("");
  const isMounted = useRef<boolean>();

  useEffect(() => {
    isMounted.current = true;
    const fetchRepos = async () => {
      const weekAgo = format(sub(new Date(), { days: 7 }), "yyyy-MM-dd");
      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=created:%3E${weekAgo}%20language:${languageFilter}&sort=stars&order=desc`
        );
        const result = await response.json();

        if (isMounted.current && result.items?.length) {
          setRepos(result.items);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    fetchRepos();
    return () => {
      isMounted.current = false;
    };
  }, [languageFilter, setIsLoading, setRepos]);

  // Add the repo as a favourite, or remove if it's already a favourite.
  const handleFavouriteClick = (newFave: Repository) =>
    setFavourites((prevFaves) => {
      const nextFaves = prevFaves.find(({ id }) => id === newFave.id)
        ? prevFaves.filter(({ id }) => id !== newFave.id)
        : [...prevFaves, newFave];
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
              data-testid="fav-button"
            >
              Favourites
            </Button>
          </ButtonGroup>
        </Label>
      </SpaceBetween>

      {isLoading && <Spinner data-testid="loading-spinner" />}

      {repos && (
        <>
          {!showFavourites && (
            <HTMLSelect
              options={[
                { label: "Show all Languages", value: "" },
                ...availableLanguages,
              ]}
              value={languageFilter}
              onChange={(e) => {
                setIsLoading(true);
                setRepos(undefined);
                setLanguageFilter(e.currentTarget.value);
              }}
              data-testid="language-filter"
            />
          )}

          {(showFavourites ? favourites : repos).map((repo) => (
            <RepoCard
              key={repo.id}
              {...repo}
              isFavourite={!!favourites.find(({ id }) => id === repo.id)}
              onClick={handleFavouriteClick}
              data-testid={`card${repo.id}`}
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
