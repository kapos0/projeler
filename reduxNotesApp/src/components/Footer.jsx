import { memo } from "react";
function Footer() {
  return (
    <footer className="text-center text-secondary mt-3">
      <p>Mehmet Enes Turhan</p>
      <a>A simple notes app made with react using redux toolkit</a>
    </footer>
  );
}
export default memo(Footer);
