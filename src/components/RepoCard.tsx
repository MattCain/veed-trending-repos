import { FC, ReactElement } from "react";
import { Card, H5, Icon, Tag, Text } from "@blueprintjs/core";
import styled from "styled-components";
import { SpaceBetween } from "./Layout";
import { Repository } from "../types";
import { formatDistanceToNow } from "date-fns";

const StyledCard = styled(Card)`
  margin-top: 2vh;
`;

const Stars = styled.span`
  display: flex;
  align-items: flex-start;
  color: #ffbb00;
`;

const StarIcon = styled(Icon)`
  margin-right: 3px;
`;

const Created = styled(Text)`
  color: gray;
  margin-bottom: 10px;
`;

const FavouritesIcon = styled(Icon)`
  cursor: pointer;
`;

type Props = {
  isFavourite: boolean;
  onClick: (repo: Repository) => void;
  ["data-testid"]: string;
};

export const RepoCard: FC<Repository & Props> = ({
  isFavourite,
  onClick,
  "data-testid": dataTestId,
  ...repo
}): ReactElement => {
  return (
    <StyledCard>
      <SpaceBetween>
        <H5>
          <a href={repo.html_url} target="_blank" rel="noreferrer">
            {repo.name}
          </a>
        </H5>
        <Stars>
          <StarIcon icon="star" />
          <Text>{repo.stargazers_count}</Text>
        </Stars>
      </SpaceBetween>
      <p>{repo.description}</p>
      <Created>{formatDistanceToNow(new Date(repo.created_at))} old</Created>
      <SpaceBetween>
        <div>{repo.language && <Tag>{repo.language}</Tag>}</div>
        <FavouritesIcon
          icon="heart"
          color={isFavourite ? "red" : "gray"}
          onClick={() => onClick(repo)}
          data-testid={`${dataTestId}-favourite`}
        />
      </SpaceBetween>
    </StyledCard>
  );
};
