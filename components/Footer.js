import { useTheme } from "next-themes";
import Moon from "../icons/Moon";
import Sun from "../icons/Sun";

export default function Footer() {

  const { theme, setTheme } = useTheme()

  return (
    <footer className="flex justify-between items-center">
      <span>

        &copy; {new Date().getFullYear()} Matteo Gassend
      </span>
      <div>
        {theme === "light" && <Moon className="w-6 h-6" onClick={() => {
          setTheme("dark")
        }} />}
        {theme === "dark" && <Sun className="w-6 h-6" onClick={() => {
          setTheme("light")
        }} />}


      </div>
    </footer>
  )
}