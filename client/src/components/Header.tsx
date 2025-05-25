import useContext from "@/hooks/useContext";
import { Video } from "lucide-react";
import { NavLink } from "react-router";

export default function Header() {
  const { user } = useContext();

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
            {user ? (
              <NavLink to="/sign-out">Sign out</NavLink>
            ) : (
              <>
                <NavLink to="/sign-in">Sign in</NavLink>
                <NavLink to="/sign-up">Sign up</NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
