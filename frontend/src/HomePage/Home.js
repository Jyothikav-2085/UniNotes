import React, { useState, useEffect, useRef } from "react";
import "./home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faMoon,
  faSun,
  faLaptopCode,
  faDatabase,
  faRobot,
  faBrain,
  faBroadcastTower,
  faBolt,
  faCogs,
  faHardHat,
  faDraftingCompass,
  faGraduationCap,
  faBook,
  faBookOpen,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [section, setSection] = useState("home");
  const [selectedDep, setSelectedDep] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [pdfStorage, setPdfStorage] = useState({});

  const isPopState = useRef(false);

  const subjectsData = {
    "1 Semester": ["Mathematics I", "Physics", "Programming in C", "Basic Electrical", "Engineering Graphics"],
    "2 Semester": ["Mathematics II", "Chemistry", "Data Structures", "Electronics", "Mechanics"],
  };

  // Push history only for forward navigation
  useEffect(() => {
    if (!isPopState.current) {
      window.history.pushState(
        { section, selectedDep, selectedYear, selectedSubject, selectedUnit },
        ""
      );
    }
    isPopState.current = false;
  }, [section, selectedDep, selectedYear, selectedSubject, selectedUnit]);

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        isPopState.current = true;
        setSection(event.state.section || "home");
        setSelectedDep(event.state.selectedDep || "");
        setSelectedYear(event.state.selectedYear || "");
        setSelectedSubject(event.state.selectedSubject || "");
        setSelectedUnit(event.state.selectedUnit || "");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Navigation functions
  const selectDepartment = (dep) => {
    setSelectedDep(dep);
    setSection("department");
  };

  const selectYear = (year) => {
    setSelectedYear(year);
    setSection("subjects");
  };

  const selectSubject = (sub) => {
    setSelectedSubject(sub);
    setSection("units");
  };

  const selectUnit = (unit) => {
    setSelectedUnit(unit);
    setSection("pdfs");
  };

  const handlePDFUpload = (e) => {
    e.preventDefault();
    const file = e.target.elements["pdf-file"].files[0];
    if (!file) return;
    const key = `${selectedYear}-${selectedSubject}-${selectedUnit}`;
    setPdfStorage((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), file.name],
    }));
    e.target.reset();
  };

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      {/* Header */}
      <header>
        <div className="logo-and-title">
          <img className="logo" src="image/Logo.jpg" alt="Logo" />
          <h1>Univ Notes</h1>
        </div>
        <nav>
          <button onClick={() => setSection("home")}>Home</button>
          <button onClick={() => setSection("about")}>About Us</button>
          <button onClick={() => setSection("contact")}>Contact Us</button>
          <button className="profile-btn">
            <FontAwesomeIcon icon={faUserCircle} /> Profile
          </button>
          <button className="toggle-dark" onClick={toggleDarkMode}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
        </nav>
      </header>

      {/* Home Section */}
      {section === "home" && (
        <section id="home">
          <h2>Select Your Department</h2>
          <div className="grid">
            <div className="card" onClick={() => selectDepartment("Computer Science")}>
              <FontAwesomeIcon icon={faLaptopCode} />
              <h3>Computer Science (CSE)</h3>
            </div>
            <div className="card" onClick={() => selectDepartment("Information Science")}>
              <FontAwesomeIcon icon={faDatabase} />
              <h3>Information Science (ISE)</h3>
            </div>
            <div className="card" onClick={() => selectDepartment("AIML")}>
              <FontAwesomeIcon icon={faRobot} />
              <h3>Artificial Intelligence and Machine Learning (AIML)</h3>
            </div>
            <div className="card" onClick={() => selectDepartment("AIDS")}>
              <FontAwesomeIcon icon={faBrain} />
              <h3>Artificial Intelligence and Data Science (AIDS)</h3>
            </div>
            <div className="card" onClick={() => selectDepartment("ECE")}>
              <FontAwesomeIcon icon={faBroadcastTower} />
              <h3>Electronics & Communication (ECE)</h3>
            </div>
            <div className="card" onClick={() => selectDepartment("EEE")}>
              <FontAwesomeIcon icon={faBolt} />
              <h3>Electrical & Electronics (EEE)</h3>
            </div>
            <div className="card" onClick={() => selectDepartment("Mechanical")}>
              <FontAwesomeIcon icon={faCogs} />
              <h3>Mechanical Engineering</h3>
            </div>
            <div className="card" onClick={() => selectDepartment("Civil")}>
              <FontAwesomeIcon icon={faHardHat} />
              <h3>Civil Engineering</h3>
            </div>
            <div className="card" onClick={() => selectDepartment("Architecture")}>
              <FontAwesomeIcon icon={faDraftingCompass} />
              <h3>Architecture</h3>
            </div>
          </div>
        </section>
      )}

      {/* Department Section */}
      {section === "department" && (
        <section>
          <button className="back-btn" onClick={() => setSection("home")}>
            Back to Home
          </button>
          <h2>{selectedDep}</h2>
          <div className="year-list">
            {(selectedDep === "Architecture" ? 10 : 8) &&
              [...Array(selectedDep === "Architecture" ? 10 : 8)].map((_, i) => (
                <div key={i} className="year-item" onClick={() => selectYear(`${i + 1} Semester`)}>
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <p>{i + 1} Semester</p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Subjects Section */}
      {section === "subjects" && (
        <section>
          <button className="back-btn" onClick={() => setSection("department")}>
            Back to Semesters
          </button>
          <h2>{selectedYear} - Subjects</h2>
          <div className="subject-list">
            {(subjectsData[selectedYear] || ["Subject 1", "Subject 2"]).map((sub, i) => (
              <div key={i} className="year-item" onClick={() => selectSubject(sub)}>
                <FontAwesomeIcon icon={faBook} />
                <p>{sub}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Units Section */}
      {section === "units" && (
        <section>
          <button className="back-btn" onClick={() => setSection("subjects")}>
            Back to Subjects
          </button>
          <h2>{selectedSubject} - Units</h2>
          <div className="unit-list">
            {[1, 2, 3, 4, 5].map((u) => (
              <div key={u} className="year-item" onClick={() => selectUnit(`Unit ${u}`)}>
                <FontAwesomeIcon icon={faBookOpen} />
                <p>Unit {u}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PDFs Section */}
      {section === "pdfs" && (
        <section>
          <button className="back-btn" onClick={() => setSection("units")}>
            Back to Units
          </button>
          <h2>{selectedUnit} - PDFs</h2>
          <form id="pdf-upload-form" onSubmit={handlePDFUpload} className="upload-form">
            <input type="file" id="pdf-file" accept=".pdf" required />
            <button type="submit">Upload</button>
          </form>
          <div className="pdf-list">
            {(pdfStorage[`${selectedYear}-${selectedSubject}-${selectedUnit}`] || []).map(
              (file, i) => (
                <div key={i} className="pdf-item">
                  <FontAwesomeIcon icon={faFilePdf} />
                  <span>{file}</span>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* About Section */}
      {section === "about" && (
        <section>
          <h2>About Us</h2>
          <p>
            Welcome to UniNotes! Our platform allows students to upload and share notes easily across
            various departments and academic years.
          </p>
        </section>
      )}

      {/* Contact Section */}
      {section === "contact" && (
        <section>
          <h2>Contact Us</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent!");
            }}
          >
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea rows="5" placeholder="Your Message" required></textarea>
            <button type="submit">Send</button>
          </form>
        </section>
      )}
    </div>
  );
};

export default Home;
