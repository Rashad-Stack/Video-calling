import { Video } from "lucide-react";
import { NavLink } from "react-router";

export default function Header() {
  return (
    <header>
      <div className="container mx-lg:max-w-6xl mx-auto py-4">
        <nav className="flex justify-between">
          <div className="flex gap-4">
            <NavLink to="/about">
              <Video />
            </NavLink>
            <NavLink to="/" end>
              Home
            </NavLink>
          </div>
          <div className="flex gap-4">
            <NavLink to="/sign-in">Sign In</NavLink>
            <NavLink to="/sign-up">Sign Up</NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}
