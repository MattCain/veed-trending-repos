import { fireEvent, render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import App from "./App";
import responseData from "./data/search.stub.json";

// mock github api request
const server = setupServer(
  rest.get("https://api.github.com/search/repositories", (req, res, ctx) =>
    res(ctx.json(responseData))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders page", () => {
  render(<App />);
  const titleElement = screen.getByText(/Trending Repos/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders the cards", async () => {
  render(<App />);
  const cardTitleElement = await screen.findAllByText(/Test Repo Name/i);
  expect(cardTitleElement).toHaveLength(responseData.items.length);
});

test("favourites a repo", async () => {
  render(<App />);
  const favButton = await screen.findAllByText(/Favourite$/i);
  fireEvent.click(favButton[0]);
  const unFavButton = await screen.findByText(/Unfavourite/i);
  expect(unFavButton).toBeInTheDocument();

  const favTab = await screen.findByTestId("fav-button");
  fireEvent.click(favTab);
  const cardTitleElement = await screen.findAllByText(/Test Repo Name/i);
  expect(cardTitleElement).toHaveLength(1);
});
