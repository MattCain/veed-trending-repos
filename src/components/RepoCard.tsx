import { FC, ReactElement } from "react";
import { Button, Card, H5, Icon, Tag, Text } from "@blueprintjs/core";
import styled from "styled-components";
import { SpaceBetween } from "./Layout";
import { Repository } from "../types";

const StyledCard = styled(Card)`
  margin-bottom: 2vh;
`;

const Stars = styled.span`
  display: flex;
  align-items: flex-start;
  color: #ffbb00;
`;

const StarIcon = styled(Icon)`
  margin-right: 3px;
`;

const FavouritesButton = styled(Button)`
  float: right;
  margin-bottom: 10px;
`;

type Props = {
  isFavourite: boolean;
  onClick: (id: number) => void;
};

export const RepoCard: FC<Repository & Props> = ({
  id,
  name,
  html_url,
  description,
  stargazers_count,
  language,
  isFavourite,
  onClick,
}): ReactElement => {
  return (
    <StyledCard>
      <SpaceBetween>
        <H5>
          <a href={html_url} target="_blank" rel="noreferrer">
            {name}
          </a>
        </H5>
        <Stars>
          <StarIcon icon="star" />
          <Text>{stargazers_count}</Text>
        </Stars>
      </SpaceBetween>
      <p>{description}</p>
      <SpaceBetween>
        <div>{language && <Tag>{language}</Tag>}</div>
        <FavouritesButton
          icon={isFavourite ? "heart-broken" : "heart"}
          onClick={() => onClick(id)}
        >
          {isFavourite ? "Unfavourite" : "Favourite"}
        </FavouritesButton>
      </SpaceBetween>
    </StyledCard>
  );
};
