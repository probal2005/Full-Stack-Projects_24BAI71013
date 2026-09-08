import { render, screen } from "@testing-library/react";
import Calendar from "../components/Calendar";

describe("Calendar Component", () => {
  test("renders calendar heading", () => {
    render(
      <Calendar
        events={[]}
        onEventClick={() => {}}
      />
    );

    expect(screen.getByText("📅 Post Calendar")).toBeInTheDocument();
  });

  test("shows no events message", () => {
    render(
      <Calendar
        events={[]}
        onEventClick={() => {}}
      />
    );

    expect(screen.getByText("No Events Found")).toBeInTheDocument();
  });

  test("renders events", () => {
    const events = [
      { id: 1, title: "React Workshop" }
    ];

    render(
      <Calendar
        events={events}
        onEventClick={() => {}}
      />
    );

    expect(screen.getByText("React Workshop")).toBeInTheDocument();
  });
});