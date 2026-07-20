const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  navLinks?.classList.toggle("is-open");
});

const reviews = [
  {
    text: "Nice dental clinic in Raja ka Talab. Dentist is professional and well spoken. Clinic have all the modern equipments to treat patients.",
    name: "Ankush Pathania",
  },
  {
    text: "Excellent experience, totally satisfied with the procedure.",
    name: "Archna Mankotia",
  },
  {
    text: "Excellent service. I recommend this clinic to all.",
    name: "AADVIK SHARMA",
  },
  {
    text: "Wonderful experience after getting my teeth alignment with ortho treatment. Experienced doctor. I would recommend this clinic for any dental problems.",
    name: "Vivek Mehra",
  },
];

let reviewIndex = 0;
const reviewCard = document.querySelector("#reviewCard");

const renderReview = () => {
  if (!reviewCard) return;
  const review = reviews[reviewIndex];
  reviewCard.innerHTML = `
    <span>*****</span>
    <p>"${review.text}"</p>
    <strong>${review.name}</strong>
  `;
};

document.querySelector("#prevReview")?.addEventListener("click", () => {
  reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length;
  renderReview();
});

document.querySelector("#nextReview")?.addEventListener("click", () => {
  reviewIndex = (reviewIndex + 1) % reviews.length;
  renderReview();
});

document.querySelector("#bookingForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = encodeURIComponent(
    `Hello Dental Care Centre, I want to book an appointment. Name: ${data.get("name")}. Phone: ${data.get("phone")}. Treatment: ${data.get("treatment")}. Preferred date: ${data.get("date")}.`
  );
  window.open(`https://wa.me/919418253659?text=${message}`, "_blank", "noopener,noreferrer");
  event.currentTarget.reset();
});

const toothPhotoInput = document.querySelector("#toothPhoto");
const photoPreview = document.querySelector("#photoPreview");
const guidanceResult = document.querySelector("#guidanceResult");
const identifyIssueButton = document.querySelector("#identifyIssue");
let latestGuidance = "";

toothPhotoInput?.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!photoPreview) return;

  if (!file) {
    photoPreview.innerHTML = "<span>No photo selected</span>";
    return;
  }

  if (!file.type.startsWith("image/")) {
    photoPreview.innerHTML = "<span>Please select an image file</span>";
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    photoPreview.innerHTML = `<img src="${reader.result}" alt="Selected tooth photo preview" />`;
  });
  reader.readAsDataURL(file);
});

document.querySelector("#photoForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const file = toothPhotoInput?.files?.[0];

  if (!file) {
    photoPreview.innerHTML = "<span>Please upload a clear tooth photo first</span>";
    return;
  }

  const guidance = buildGuidance(data);
  latestGuidance = guidance.summary;
  renderGuidance(guidance);

  const message = encodeURIComponent(
    `Hello Dental Care Centre, I want basic guidance for a dental concern. Name: ${data.get("photoName")}. Phone: ${data.get("photoPhone")}. Concern: ${data.get("photoIssue")}. Pain level: ${data.get("painLevel")}. Duration: ${data.get("issueDuration")}. Basic tool result: ${latestGuidance}. I understand this is not a diagnosis and I will attach the tooth photo here for basic guidance.`
  );

  window.open(`https://wa.me/919418253659?text=${message}`, "_blank", "noopener,noreferrer");
});

const getSelectedSymptoms = (data) => data.getAll("symptoms");

const buildGuidance = (data) => {
  const issue = data.get("photoIssue");
  const pain = data.get("painLevel");
  const duration = data.get("issueDuration");
  const symptoms = getSelectedSymptoms(data);

  let title = "Basic dental guidance";
  let urgency = "Routine clinic visit recommended";
  let tag = "routine";
  let nextStep = "Book an appointment so Dr. Sumit Sharma can examine the tooth properly.";

  const has = (value) => symptoms.includes(value);
  const severePain = pain === "Severe pain";
  const longDuration = duration === "More than a week" || duration === "More than a month";

  if (issue === "Swelling" || has("Swelling") || severePain) {
    title = "Possible urgent dental infection or inflammation";
    urgency = "Priority visit recommended";
    tag = "urgent";
    nextStep = "Please contact the clinic as soon as possible, especially if swelling, fever or severe pain is present.";
  } else if (issue === "Tooth pain" || has("Cavity / black spot")) {
    title = "Possible cavity, deep decay or nerve irritation";
    urgency = longDuration ? "Early visit recommended" : "Clinic visit recommended";
    tag = longDuration ? "watch" : "routine";
    nextStep = "Avoid chewing from the painful side and book an examination to check whether filling or root canal care is needed.";
  } else if (has("Broken tooth") || issue === "Broken tooth") {
    title = "Possible tooth fracture or chipped tooth";
    urgency = "Early visit recommended";
    tag = "watch";
    nextStep = "Keep the area clean and avoid hard food until the dentist checks whether restoration is needed.";
  } else if (issue === "Bleeding gums" || has("Bleeding gums") || has("Bad breath")) {
    title = "Possible gum inflammation or cleaning requirement";
    urgency = "Clinic visit recommended";
    tag = "routine";
    nextStep = "A dental checkup and cleaning may be needed to identify gum health concerns.";
  } else if (has("Sensitivity")) {
    title = "Possible sensitivity, enamel wear or early cavity";
    urgency = "Routine visit recommended";
    tag = "routine";
    nextStep = "Use gentle brushing and book a checkup if sensitivity continues or increases.";
  } else if (issue === "Alignment concern") {
    title = "Possible orthodontic alignment concern";
    urgency = "Consultation recommended";
    tag = "routine";
    nextStep = "An ortho consultation can help understand whether braces or aligners are suitable.";
  } else if (issue === "Smile / cosmetic concern") {
    title = "Possible cosmetic dentistry concern";
    urgency = "Smile consultation recommended";
    tag = "routine";
    nextStep = "A smile consultation can help plan whitening, reshaping, veneers or other cosmetic options.";
  } else if (issue === "Child dental concern") {
    title = "Child dental concern";
    urgency = "Pediatric dental visit recommended";
    tag = "routine";
    nextStep = "A gentle child dental checkup can confirm the concern and guide the right treatment.";
  }

  const symptomText = symptoms.length ? symptoms.join(", ") : "No visible symptoms selected";
  const summary = `${title}. Urgency: ${urgency}. Symptoms: ${symptomText}. Next step: ${nextStep}`;

  return { title, urgency, tag, nextStep, symptomText, summary };
};

const renderGuidance = (guidance) => {
  if (!guidanceResult) return;
  const tagClass = guidance.tag === "urgent" ? "urgent" : guidance.tag === "watch" ? "watch" : "";
  guidanceResult.innerHTML = `
    <span class="guidance-tag ${tagClass}">${guidance.urgency}</span>
    <h3>${guidance.title}</h3>
    <p><strong>Visible symptoms:</strong> ${guidance.symptomText}</p>
    <p><strong>Suggested next step:</strong> ${guidance.nextStep}</p>
    <p><strong>Reminder:</strong> This is basic guidance only, not a diagnosis.</p>
  `;
};

identifyIssueButton?.addEventListener("click", () => {
  const form = document.querySelector("#photoForm");
  if (!form?.reportValidity()) return;

  if (!toothPhotoInput?.files?.[0]) {
    photoPreview.innerHTML = "<span>Please upload a clear tooth photo first</span>";
    return;
  }

  const guidance = buildGuidance(new FormData(form));
  latestGuidance = guidance.summary;
  renderGuidance(guidance);
});
