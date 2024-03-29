const palette = [
  "#FF55FE",
  "#FF0054",
  "#FE0000",
  "#FF5500",
  "#FFFF01",
  "#AFFF00",
  "#00FF01",
  "#55FFFF",
  "#00AFFF",
  "#0055FE",
  "#5500FE",
  "#AF00FF",
  "#81002B",
  "#8B4512",
  "#D3AF37",
  "#006C00",
  "#008081",
  "#004771",
  "#55007F",
  "#242424",
];

const paletteNames = [
  "Pink",
  "Rose",
  "Red",
  "Orange",
  "Yellow",
  "Lime",
  "Green",
  "Cyan",
  "Sky-Blue",
  "Blue",
  "Indigo",
  "Violet",
  "Maroon",
  "Brown",
  "Gold",
  "Dark-Green",
  "Teal",
  "Navy-Blue",
  "Purple",
  "Black",
];

const inputFile = document.getElementById("input-file");
inputFile.addEventListener("change", handleFileSelect, false);

function tintImage(image, color) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);

  // convert hex color string to RGB object
  const hexToRgb = (hex) => ({
    r: parseInt(hex.substring(1, 3), 16),
    g: parseInt(hex.substring(3, 5), 16),
    b: parseInt(hex.substring(5, 7), 16),
  });

  const rgbColor = typeof color === "string" ? hexToRgb(color) : color;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const r = rgbColor.r / 255;
  const g = rgbColor.g / 255;
  const b = rgbColor.b / 255;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3] / 255;
    data[i] *= r * alpha;
    data[i + 1] *= g * alpha;
    data[i + 2] *= b * alpha;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

function clearContainers() {
  // Clear the "tinted-images" container
  const container = document.getElementById("tinted-images");
  container.innerHTML = "";

  // Clear the output container
  const outputBox = document.getElementById("output-img");
  outputBox.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  // Reset the color label
  const colorLabel = document.getElementById("color-label");
  colorLabel.textContent = "Color";
}

function handleFileSelect(event) {
  console.log("go script.js!!");

  clearContainers();

  // Get the selected file and create a URL for it
  const selectedFile = event.target.files[0];
  const url = URL.createObjectURL(selectedFile);

  // Display the selected image in the preview element
  const preview = document.getElementById("preview");
  preview.src = url;

  processImageEntry(url);
}

// Remove everything after the file extension.
// Example:
// Input: https://example.net/images/Feesh_2.png/revision/latest/
// Output: https://example.net/images/Feesh_2.png
function linkFilter(inputLink) {
  // Find the position of the last dot in the inputLink string
  const dotIndex = inputLink.lastIndexOf(".");

  // If there is no dot in the inputLink, return the original inputLink
  if (dotIndex === -1) {
    return inputLink;
  }

  // Find the position of the last forward slash after the dot
  const slashIndex = inputLink.indexOf("/", dotIndex);

  // If there is no forward slash after the dot, return the original inputLink
  if (slashIndex === -1) {
    return inputLink;
  }

  // Return the substring from the beginning of the inputLink to the position of the slash after the dot
  return inputLink.substring(0, slashIndex);
}

function handleLinkSubmission() {
  const corsProxy = "https://api.allorigins.win/raw?url=";
  var inputLink = document.getElementById("input-link").value;
  var filteredLink = linkFilter(inputLink);
  console.log({ filteredLink });

  clearContainers();

  const preview = document.getElementById("preview");

  // Try making a request without the proxy
  fetch(filteredLink, { mode: "cors" })
    .then((response) => {
      // If the response status is ok, set the preview source directly
      console.log({response});
      if (response.ok) {
        preview.src = filteredLink;
        processImageEntry(filteredLink);
      } else {
        // If there is a CORS error, use the proxy server
        preview.src = corsProxy + filteredLink;
        processImageEntry(corsProxy + filteredLink);
      }
    })
    .catch(() => {
      // If there is an error making the request, use the proxy server
      preview.src = corsProxy + filteredLink;
      processImageEntry(corsProxy + filteredLink);
    });
}

function processImageEntry(imgUrl) {
  // Generate the tinted versions of the image and display them on the canvas
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imgUrl;
  img.onload = function () {
    for (let i = 0; i < palette.length; i++) {
      const dataUrlResult = tintImage(img, palette[i]);
      const imgResult = document.createElement("img");
      imgResult.src = dataUrlResult;
      imgResult.classList.add(paletteNames[i]);

      // Make it clickable!
      imgResult.addEventListener("click", function () {
        console.log("Clicked!");
        document.getElementById("output-img").src = this.src;
        document.getElementById("color-label").textContent =
          this.classList[0].replace(/-/g, " ");
          document.getElementById("color-label").style.color = palette[i];
      });

      // Append the <img> elements to a container element
      const container = document.getElementById("tinted-images");
      container.appendChild(imgResult);
    }
  };
}
