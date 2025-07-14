import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <div className="w-full p-5 bg-[#6493bb]">
      <div className='flex flex-row justify-start gap-6 items-center text-xl font-["Cambria",_serif]'>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-slate-100 font-bold underline"
              : "font-bold text-slate-900 hover:text-slate-100"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            isActive
              ? "text-slate-100 font-bold underline"
              : "font-bold text-slate-900 hover:text-slate-100"
          }
        >
          Favorites
        </NavLink>

        <NavLink
          to="/account"
          className={({ isActive }) =>
            isActive
              ? "text-slate-100 font-bold underline"
              : "font-bold text-slate-900 hover:text-slate-100"
          }
        >
          Account
        </NavLink>
      </div>
    </div>
  );
}

export default Navbar;
