document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.innerHTML = navLinks.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    const links = navLinks.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  const header = document.getElementById("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.1)";
      header.style.padding = "5px 0";
    } else {
      header.style.boxShadow = "0 2px 15px rgba(0, 0, 0, 0.05)";
      header.style.padding = "0";
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatableElements = document.querySelectorAll(
    ".fade-in-up, .fade-in-left, .fade-in-right",
  );
  animatableElements.forEach((el) => observer.observe(el));

  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const closeBtn = document.querySelector(".close-modal");

  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      modal.style.display = "block";
      document.body.style.overflow = "hidden";

      if (img) {
        modalImg.src = img.src;
      }
    });
  });

  // Close modal when X is clicked
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    });
  }

  const contactModal = document.getElementById("contact-modal");
  const openContactBtn = document.getElementById("open-contact-btn");
  const closeContactBtn = document.querySelector(".close-contact-modal");

  if (openContactBtn && contactModal) {
    openContactBtn.addEventListener("click", (e) => {
      e.preventDefault();
      contactModal.style.display = "block";
      document.body.style.overflow = "hidden";
    });
  }

  if (closeContactBtn && contactModal) {
    closeContactBtn.addEventListener("click", () => {
      contactModal.style.display = "none";
      document.body.style.overflow = "auto";
    });
  }

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
    if (e.target === contactModal) {
      contactModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  const telegramForm = document.getElementById("telegram-form");
  const formStatus = document.getElementById("form-status");

  const TELEGRAM_BOT_TOKEN = "8758710566:AAH5mba7dJ2gl6NeOTD2o8dnACFUgJq8YHY";
  const TELEGRAM_CHAT_IDS = [
    "-5240141376"
  ]; 

  if (telegramForm) {
    telegramForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const request = document.getElementById("request").value.trim();

      if (!name || !phone || !request) return;

      const message = `🔔 *Новая заявка*\n\n👤 *Имя:* ${name}\n📞 *Телефон:* ${phone}\n💬 *Запрос:* ${request}`;
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

      formStatus.style.display = "block";
      formStatus.innerText = "Отправка всем получателям...";
      formStatus.style.color = "#333";

      const requests = TELEGRAM_CHAT_IDS.map((chatId) => {
        return fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId.trim(),
            text: message,
            parse_mode: "Markdown",
          }),
        }).then((res) => res.json());
      });

      Promise.all(requests)
        .then((results) => {
          const hasSuccess = results.some((res) => res.ok);

          if (hasSuccess) {
            formStatus.innerText = "Заявка успешно отправлена!";
            formStatus.style.color = "green";
            telegramForm.reset();
            setTimeout(() => {
              contactModal.style.display = "none";
              document.body.style.overflow = "auto";
              formStatus.style.display = "none";
            }, 3000);
          } else {
            formStatus.innerText = "Ошибка отправки. Проверьте Token и Chat IDs.";
            formStatus.style.color = "red";
            console.error(results);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          formStatus.innerText = "Ошибка сети.";
          formStatus.style.color = "red";
        });
    });
  }
});
