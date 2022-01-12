import { NonIdealState } from "@blueprintjs/core";
import styled from "styled-components";

export const Wrapper = styled.main`
  width: 90vw;
  max-width: 800px;
  margin: 0 auto;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  margin: 3vh 0;
`;

export const StyledNotIdealState = styled(NonIdealState)`
  text-align: center;
`;

export const SpaceBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
