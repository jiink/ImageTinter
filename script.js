const palette = [
	"#FF55FE", "#FF0054", "#FE0000", "#FF5500",
	"#FFFF01", "#AFFF00", "#00FF01", "#55FFFF",
	"#00AFFF", "#0055FE", "#5500FE", "#AF00FF",
	"#81002B", "#8B4512", "#D3AF37", "#006C00",
	"#008081", "#004771", "#55007F", "#242424"
];

const inputFile = document.getElementById('input-file');
inputFile.addEventListener('change', handleFileSelect, false);

function tintImage(image, color) {
	const canvas = document.createElement('canvas');
	canvas.width = image.width;
	canvas.height = image.height;
	const ctx = canvas.getContext('2d');

	ctx.drawImage(image, 0, 0);

	// convert hex color string to RGB object
	const hexToRgb = hex => ({
		r: parseInt(hex.substring(1, 3), 16),
		g: parseInt(hex.substring(3, 5), 16),
		b: parseInt(hex.substring(5, 7), 16)
	});

	const rgbColor = typeof color === 'string' ? hexToRgb(color) : color;

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

function handleFileSelect(event) {
	console.log("go script.js!!");

	// Clear the "tinted-images" container
	const container = document.getElementById('tinted-images');
	container.innerHTML = '';

	// Get the selected file and create a URL for it
	const selectedFile = event.target.files[0];
	const url = URL.createObjectURL(selectedFile);

	// Display the selected image in the preview element
	const preview = document.getElementById('preview');
	preview.src = url;

	// Generate the tinted versions of the image and display them on the canvas
	const img = new Image();
	img.src = url;
	img.onload = function () {
		for (let i = 0; i < palette.length; i++){
			const dataUrlResult = tintImage(img, palette[i]);
			const imgResult = document.createElement('img');
			imgResult.src = dataUrlResult;

			// Append the <img> elements to a container element
			const container = document.getElementById('tinted-images')
			container.appendChild(imgResult);
		}
	}
}