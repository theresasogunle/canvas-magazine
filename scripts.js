const bodyTag = document.querySelector("body");

const runScript = () => {
  const headers = document.querySelectorAll("h2, h3");
  const imageHolders = document.querySelectorAll("div.image");

  const observer = new IntersectionObserver(
    (enteries) => {
      enteries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.1) {
          entry.target.classList.add("in-view");
        } else {
          entry.target.classList.remove("in-view");
        }
      });
    },
    {
      threshold: [0, 0.1, 1.0]
    }
  );

  headers.forEach((header) => {
    observer.observe(header);
  });

  imageHolders.forEach((holder) => {
    observer.observe(holder);
  });
};

runScript();

barba.init({
  transitions: [
    {
      name: "switch",
      once({ current, next, trigger }) {
        return new Promise((resolve) => {
          const tl = gsap.timeline({
            onComplete() {
              resolve();
            }
          });
          tl.set(next.container, { opacity: 0 }).to(next.container, {
            opacity: 1,
            delay: 1
          });
        });
      },
      leave({ current, next, trigger }) {
        return new Promise((resolve) => {
          const tl = gsap.timeline({
            onComplete() {
              current.container.remove();
              resolve();
            }
          });
          tl.to("header", { y: "-100%" }, 0)
            .to("footer", { y: "100%" }, 0)
            .to(current.container, { opacity: 0 });
        });
      },
      enter({ current, next, trigger }) {
        return new Promise((resolve) => {
          window.scrollTo({ top: 0, behavior: "smooth" });

          const timeline = gsap.timeline({
            onComplete() {
              runScript();
              resolve();
            }
          });
          timeline.set(next.container, { opacity: 1 });
          timeline.to("header", { x: "0%" }, 0);
          timeline
            .to("footer", { y: "0%" }, 0)
            .to(next.container, { opacity: 1 });
        });
      }
    }
  ],
  views: [
    {
      namespace: "product",
      beforeEnter() {
        bodyTag.classList.add("product");
      },
      afterLeave() {
        bodyTag.classList.remove("product");
      }
    }
  ],
  debug: true
});
