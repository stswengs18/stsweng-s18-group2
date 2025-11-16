import React from "react";

export default function NavLabelButton({
  title,
  iconClass,
  sectionId,
  currentSection,
  setCurrentSection
}) {
  const handleClick = () => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      if (setCurrentSection) {
        setCurrentSection(sectionId);
      }
    }
  };

  return (
    <button
      className="icon-text-group flex gap-5 font-bold-label"
      title={title}
      onClick={handleClick}
    >
      <div className={`icon-button-setup ${iconClass}`}></div>
      <p
        className="icon-text-label overflow-hidden whitespace-nowrap transition-all duration-300"
        style={{
          maxWidth: currentSection === sectionId ? "20rem" : "0rem"
        }}
      >
        {title}
      </p>
    </button>
  );
}
