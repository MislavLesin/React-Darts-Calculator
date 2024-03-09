import "./App.css";
export function MessageContainer({ children }) {
  return (
    <div className="selected-container">
      <h2>{children}</h2>
    </div>
  );
}
