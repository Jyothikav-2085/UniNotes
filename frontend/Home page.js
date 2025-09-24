
    function toggleDarkMode() {
      document.body.classList.toggle("dark-mode");
      const icon = document.querySelector(".toggle-dark i");
      if (document.body.classList.contains("dark-mode")) {
        icon.className = "fas fa-sun";
      } else {
        icon.className = "fas fa-moon";
      }
    }

    function showSection(sectionId) {
      const sections = ["home", "department", "subjects", "units", "pdfs", "about", "contact"];
      sections.forEach((id) => {
        document.getElementById(id).style.display = id === sectionId ? "block" : "none";
      });
    }

    function selectDepartment(dep) {
      showSection("department");
      document.getElementById("dep-title").textContent = dep;

      const yearList = document.getElementById("year-list");
      yearList.innerHTML = "";

      const totalSemesters = dep === "Architecture" ? 10 : 8;
      for (let i = 1; i <= totalSemesters; i++) {
        const yearItem = document.createElement("div");
        yearItem.className = "year-item";
        yearItem.onclick = () => selectYear(i + " Semester");
        yearItem.innerHTML = `<i class="fas fa-graduation-cap"></i><p>${i} Semester</p>`;
        yearList.appendChild(yearItem);
      }
    }

    let selectedYear, selectedSubject, selectedUnit;

    const subjectsData = {
      "1 Semester": ["Mathematics I", "Physics", "Programming in C", "Basic Electrical", "Engineering Graphics"],
      "2 Semester": ["Mathematics II", "Chemistry", "Data Structures", "Electronics", "Mechanics"]
    };

    const pdfStorage = {};

    function selectYear(year) {
      showSection("subjects");
      document.getElementById("subject-title").textContent = year + " - Subjects";
      selectedYear = year;

      const subjectList = document.getElementById("subject-list");
      subjectList.innerHTML = "";

      const subjects = subjectsData[year] || ["Subject 1", "Subject 2"];
      subjects.forEach((sub) => {
        const subjectItem = document.createElement("div");
        subjectItem.className = "year-item";
        subjectItem.onclick = () => selectSubject(sub);
        subjectItem.innerHTML = `<i class="fas fa-book"></i><p>${sub}</p>`;
        subjectList.appendChild(subjectItem);
      });
    }

    function selectSubject(subject) {
      showSection("units");
      document.getElementById("year-unit-title").textContent = subject + " - Units";
      selectedSubject = subject;

      const unitList = document.getElementById("unit-list");
      unitList.innerHTML = "";

      for (let i = 1; i <= 5; i++) {
        const unitItem = document.createElement("div");
        unitItem.className = "year-item";
        unitItem.onclick = () => selectUnit("Unit " + i);
        unitItem.innerHTML = `<i class="fas fa-book-open"></i><p>Unit ${i}</p>`;
        unitList.appendChild(unitItem);
      }
    }

    function selectUnit(unit) {
      showSection("pdfs");
      document.getElementById("unit-pdf-title").textContent = unit + " - PDFs";
      selectedUnit = unit;
      renderPDFs();
    }

    function toggleUploadForm() {
      const form = document.getElementById("upload-form");
      form.style.display = form.style.display === "block" ? "none" : "block";
    }

    function openPDF(filename) {
      alert("Opening " + filename);
    }

    function renderPDFs() {
      const list = document.getElementById("pdf-list");
      list.innerHTML = "";

      const key = `${selectedYear}-${selectedSubject}-${selectedUnit}`;
      const pdfs = pdfStorage[key] || [];

      pdfs.forEach((file) => {
        const newItem = document.createElement("div");
        newItem.className = "pdf-item";
        newItem.onclick = () => openPDF(file);
        newItem.innerHTML = `<i class="fas fa-file-pdf"></i><span>${file}</span>`;
        list.appendChild(newItem);
      });
    }

    document.getElementById("pdf-upload-form").addEventListener("submit", function(e) {
      e.preventDefault();
      const fileInput = document.getElementById("pdf-file");
      const file = fileInput.files[0];
      if (!file) {
        alert("Please select a PDF file.");
        return;
      }

      const key = `${selectedYear}-${selectedSubject}-${selectedUnit}`;
      if (!pdfStorage[key]) pdfStorage[key] = [];
      pdfStorage[key].push(file.name);

      alert(`PDF '${file.name}' uploaded for ${selectedSubject} - ${selectedUnit}`);
      fileInput.value = "";
      toggleUploadForm();
      renderPDFs();
    });

    document.getElementById('contact').addEventListener('submit', function(e){
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const status = document.getElementById('form-status');
      if(!name || !email || !message){
        status.textContent = 'Please fill all fields.'; return;
      }
      // rudimentary email check
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
        status.textContent = 'Please use a valid email.'; return;
      }
      status.textContent = 'Sending...';
      // simulate network
      setTimeout(()=>{
        status.textContent = 'Message sent — thank you!';
        this.reset();
      }, 900);
    });
