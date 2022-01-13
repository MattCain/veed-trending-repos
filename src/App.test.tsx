import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import App from "./App";
import responseData from "./data/search.stub.json";
import filteredResponseData from "./data/search-filtered.stub.json";

// mock github api request
const server = setupServer(
  rest.get("https://api.github.com/search/repositories", (req, res, ctx) => {
    const query = req.url.searchParams.get("q");
    if (query?.includes("language:Javascript")) {
      return res(ctx.json(filteredResponseData));
    }
    return res(ctx.json(responseData));
  })
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
  // Click a favourite icon
  const favButton = await screen.findByTestId("card1-favourite");
  fireEvent.click(favButton);

  // Go to the favourites tab
  const favTab = await screen.findByTestId("fav-button");
  fireEvent.click(favTab);

  // Check there is at least one card there.
  const cardTitleElement = await screen.findAllByText(/Test Repo Name/i);
  expect(cardTitleElement).toHaveLength(1);
});

test("uses the language filter", async () => {
  render(<App />);
  // Pick an option from the language filter
  const langFilterSelect = await screen.findByTestId("language-filter");
  userEvent.selectOptions(langFilterSelect, "Javascript");

  // Check that the data changed
  const cardTitleElement = await screen.findAllByText(/Test Repo Name/i);
  expect(cardTitleElement).toHaveLength(1);
});
