function toggleMenu() {
  const navLinks = document.getElementById("navbar");
  navLinks.style.display =
    navLinks.style.display === "flex" ? "none" : "flex";
}

// Close the mobile menu after clicking a link
document.querySelectorAll(".nav__links a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 640) {
      document.getElementById("navbar").style.display = "none";
    }
  });
});
