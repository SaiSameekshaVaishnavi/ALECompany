import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/contact.css";

console.log("Contact component is rendering");
function Contact() {

  const year = new Date().getFullYear();
  useEffect(() => {
    const element = document.getElementById("contact");
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.add("slide-up"); 
            observer.unobserve(entry.target); 
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="footer-container" id="contact">
      <section className="footer-subscription">
        <p className="footer-subscription-heading">
          To receive event updates, subscribe to our community Channel
        </p>
        <p className="footer-subscription-text">
          You can unsubscribe at any time.
        </p>
        <div className="input-areas">
          <form>
            <input
              className="footer-input"
              name="email"
              type="email"
              placeholder="Your Email"
            ></input>
            <button
              className="btna"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
      <section class="social-media">
        <div class="social-media-wrap">
          <small class="website-rights">ALE © {year}</small>
          <div class="social-icons">
            <Link
              class="social-icon-link facebook"
              to="/"
              target="_blank"
              aria-label="Facebook"
            >
              <i class="fab fa-facebook-f" />
            </Link>
            <Link
              class="social-icon-link instagram"
              to="/"
              target="_blank"
              aria-label="Instagram"
            >
              <i class="fab fa-instagram" />
            </Link>
            <Link
              class="social-icon-link youtube"
              to="/"
              target="_blank"
              aria-label="Youtube"
            >
              <i class="fab fa-youtube" />
            </Link>
            <Link
              class="social-icon-link twitter"
              to="/"
              target="_blank"
              aria-label="Twitter"
            >
              <i className="fab fa-x-twitter"></i>
            </Link>
            <Link
              class="social-icon-link linkedin"
              to="/"
              target="_blank"
              aria-label="LinkedIn"
            >
              <i class="fab fa-linkedin"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Contact;
