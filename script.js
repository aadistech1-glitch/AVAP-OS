var biggestIndex = 1;
var selectedIcon = undefined;
var topBar = document.querySelector("#top-bar");

function updateTime() {
  var currentTime = new Date().toLocaleString();
  var timeEl = document.querySelector("#time");
  if (timeEl) timeEl.innerHTML = currentTime;
}
setInterval(updateTime, 1000);
updateTime();

function dragElement(element) {
  var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
  var header = document.getElementById(element.id + "header");

  if (header) {
    header.onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = moveElement;
  }

  function moveElement(e) {
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
    element.style.transform = "none";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function handleWindowTap(element) {
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  if (topBar) topBar.style.zIndex = biggestIndex + 1000;
  if (selectedIcon) deselectIcon(selectedIcon);
}

function addWindowTapHandling(element) {
  element.addEventListener("mousedown", function() {
    handleWindowTap(element);
  });
}

function openWindow(element) {
  element.classList.remove('hidden');
  biggestIndex++;
  element.style.zIndex = biggestIndex;
  if (topBar) topBar.style.zIndex = biggestIndex + 1000;
}

function closeWindow(element) {
  if (!element) return;
  element.classList.add('hidden');
}

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element;
}

function deselectIcon(element) {
  if (element) element.classList.remove("selected");
  selectedIcon = undefined;
}

function handleIconTap(element, windowElement) {
  if (element.classList.contains("selected")) {
    deselectIcon(element);
  } else {
    if (selectedIcon) deselectIcon(selectedIcon);
    selectIcon(element);
  }
  if (windowElement) openWindow(windowElement);
}

function initializeWindow(idName) {
  var win = document.querySelector("#" + idName);
  var closeBtn = document.querySelector("#" + idName + "close");
  var icon = document.querySelector("#" + idName + "Icon");

  if (win) {
    dragElement(win);
    addWindowTapHandling(win);
  }

  if (closeBtn && win) {
    closeBtn.addEventListener("click", function() {
      closeWindow(win);
    });
  }

  if (icon && win) {
    icon.addEventListener("click", function() {
      handleIconTap(icon, win);
    });
  }
}

initializeWindow("welcome");
initializeWindow("notes");
initializeWindow("photo");

var welcomeScreen = document.querySelector("#welcome");
var welcomeScreenOpen = document.querySelector("#welcomeopen");
var welcomeScreenClose = document.querySelector("#welcomeclose");

if (welcomeScreenClose) {
  welcomeScreenClose.addEventListener("click", function() {
    if (welcomeScreenOpen) welcomeScreenOpen.style.display = 'inline-block';
    localStorage.setItem('welcomeHidden', '1');
  });
}

if (welcomeScreenOpen) {
  welcomeScreenOpen.addEventListener("click", function() {
    openWindow(welcomeScreen);
    welcomeScreenOpen.style.display = 'none';
    localStorage.removeItem('welcomeHidden');
  });
}

if (localStorage.getItem('welcomeHidden')) {
  if (welcomeScreen) welcomeScreen.classList.add('hidden');
  if (welcomeScreenOpen) welcomeScreenOpen.style.display = 'inline-block';
} else {
  if (welcomeScreenOpen) welcomeScreenOpen.style.display = 'none';
}

var dockNotes = document.querySelector("#dock-notes");
var notesWin = document.querySelector("#notes");
if (dockNotes && notesWin) {
  dockNotes.addEventListener("click", function() {
    openWindow(notesWin);
  });
}

var content = [
  {
    title: "Welcome",
    date: "06/28/2026",
    content: `<p>Welcome to <strong>AVAPnotes</strong>!</p><br><p>place for your thoughts and ideas(coming soon!)</p>`
  },
  {
    title: "Sample Text",
    date: "06/28/2026",
    content: `<p>More coming soon!!!!!!!!</p>`
  }
];

function setNotesContent(index) {
  var noteBody = document.querySelector("#note-body");
  if (noteBody && content[index]) {
    noteBody.innerHTML = content[index].content;
  }
}

function populateNotesSidebar() {
  var sidebar = document.querySelector("#sidebar");
  if (!sidebar) return;
  sidebar.innerHTML = "";

  for (let i = 0; i < content.length; i++) {
    let note = content[i];
    let item = document.createElement("div");
    item.className = "sidebar-item";
    item.innerHTML = `<p style="margin:0; font-size:12px; font-weight:600;">${note.title}</p><p style="margin:0; font-size:10px; opacity:0.7;">${note.date}</p>`;
    item.addEventListener("click", function() {
      setNotesContent(i);
    });
    sidebar.appendChild(item);
  }
}

populateNotesSidebar();
setNotesContent(0);