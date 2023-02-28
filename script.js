const palette = [
	"#FF55FE", "#FF0054", "#FE0000", "#FF5500",
	"#FFFF01", "#AFFF00", "#00FF01", "#55FFFF",
	"#00AFFF", "#0055FE", "#5500FE", "#AF00FF",
	"#81002B", "#8B4512", "#D3AF37", "#006C00",
	"#008081", "#004771", "#55007F", "#242424"
];

const inputFile = document.getElementById('input-file');
inputFile.addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
	console.log("go script.js!!");
	// Get the selected file and create a URL for it
	const selectedFile = event.target.files[0];
	const url = URL.createObjectURL(selectedFile);
  
	// Display the selected image in the preview element
	const preview = document.getElementById('preview');
	preview.src = url;
  
	// Generate the tinted versions of the image and display them on the canvas
	const img = new Image();
	img.src = url;
	img.onload = function() {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		// Set the canvas dimensions to match the image
		canvas.width = img.width;
		canvas.height = img.height;

		// Draw the original image onto the canvas
		ctx.drawImage(img, 0, 0);

		// Create a color-tinted version of the image using a red color overlay
		ctx.globalCompositeOperation = 'multiply';
		ctx.fillStyle = palette[0];
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Convert the canvas data to a data URL and create an <img> element for each tinted version
		const dataUrlRed = canvas.toDataURL();
		const imgRed = document.createElement('img');
		imgRed.src = dataUrlRed;

		// Append the <img> elements to a container element
		const container = document.getElementById('tinted-images')
		container.appendChild(imgRed);
		//reader.readAsDataURL(input.files[0]);
	}
}