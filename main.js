(function () {
  document.querySelectorAll(".yr").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Mobile menu
  var burger = document.querySelector(".burger");
  var menu = burger && burger.nextElementSibling;
  if (burger) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
  }

  // FAQ: keep one answer open at a time within a group
  document.querySelectorAll(".faq details").forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      d.parentElement.querySelectorAll("details[open]").forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  // Preselect the enquiry type from ?service=... (used by "Enquire" links on service pages)
  var params = new URLSearchParams(location.search);
  var svc = params.get("service");
  var select = document.querySelector("select[name='Enquiry about']");
  if (svc && select) {
    Array.prototype.forEach.call(select.options, function (o) { if (o.value === svc || o.text === svc) select.value = o.value; });
  }
  var dest = params.get("to");
  var toField = document.querySelector("input[name='To']");
  if (dest && toField) toField.value = dest;

  // Forms are delivered to it@flydirham.com by FormSubmit (formsubmit.co)
  document.querySelectorAll("form[data-subject]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = String(value).trim(); });
      var subject = form.getAttribute("data-subject");
      if (data.To) subject += ": " + (data.From || "Dubai") + " to " + data.To;
      else if (data["Enquiry about"]) subject += ": " + data["Enquiry about"];
      data._subject = subject;
      data._template = "table";
      data._captcha = "false";

      var btn = form.querySelector("button[type=submit]");
      var note = form.querySelector(".form-note");
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending...";
      note.className = "form-note";
      note.textContent = "";

      fetch("https://formsubmit.co/ajax/it@flydirham.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (String(res.success) !== "true") throw new Error(res.message);
          form.reset();
          note.className = "form-note ok";
          note.textContent = "Thank you! We've received your request and will get back to you shortly.";
        })
        .catch(function () {
          note.className = "form-note err";
          note.innerHTML = 'Sorry, your message could not be sent. Please call us on <a href="tel:+97142353931">+971 4 235 3931</a> or email <a href="mailto:info@flydirham.com">info@flydirham.com</a>.';
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = label;
        });
    });
  });
})();
