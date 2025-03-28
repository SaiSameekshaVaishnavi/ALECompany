import { useEffect } from "react";
import { Link } from "react-router-dom";
import Contact from "./contact";
import Button from "../components/Button"
import "../css/mainpage.css";


console.log("MainPage component is rendering");
function MainPage() {
  useEffect(() => {
    const elements = document.querySelectorAll(".btn");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry, index) => {
          // const index=Array.from(elements).indexOf(entry.target);
          if (entry.isIntersecting) {
            if (index % 2 === 0) {
              entry.target.classList.add("slide-left");
            } else {
              entry.target.classList.add("slide-right");
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    setTimeout(
      Array.from(elements).forEach((el) => observer.observe(el)),
      2000
    );

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div className="main-page">
        <div className="content">
          <Button className="btn">
            <Link to="/register" className="al">
             Register
            </Link>
          </Button>

          <Button className="btn">
            <Link to="/LoginData" className="al">
              Login
            </Link>
          </Button>
        </div>
      </div>
      <Contact />
    </div>
  );
}
export default MainPage;
