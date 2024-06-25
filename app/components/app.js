import imageCompression from "/node_modules/browser-image-compression/dist/browser-image-compression.mjs";

const input = document.getElementById("file-input");
const submitButton = document.querySelector(".app__button");
const appOuputContainer = document.getElementById("app-output");

/* Image Handlers */
const imgContainer = document.querySelector(".app__img-container");
const imgPreview = document.querySelector(".app__img-preview");

addEventListener("DOMContentLoaded", () => {
  input.addEventListener("change", (event) => {
    /* Get Image file from input */
    const file = event.target.files[0];

    /* Display Image Preview after input change */
    if (file) {
      const imgFile = URL.createObjectURL(file);

      imgPreview.src = imgFile;

      imgContainer.style.display = "flex";

      setTimeout(() => {
        imgContainer.style.opacity = "1";
      }, 500);
    }

    /* Compress Image File */

    const getCompressedFile = async (file) => {
      const compressedFile = await handleImageUpload(file);

      if (compressedFile) {
        console.log("compressedFile", compressedFile);

        generateDownloadLink(compressedFile);
      }
    };

    submitButton.addEventListener("click", (e) => {
      e.preventDefault();

      getCompressedFile(file);
    });
  });
});

async function handleImageUpload(file) {
  const imageFile = file;
  console.log("originalFile instance of Blob", imageFile instanceof Blob); // true
  console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);

    console.log(
      "compressedFile instanceof Blob",
      compressedFile instanceof Blob
    ); // true

    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

    // Send compressed file to server
    return compressedFile;
  } catch (error) {
    console.log(error);
  }
}

const generateDownloadLink = (compressedFile) => {
  const downloadLink = document.createElement("a");

  downloadLink.href = URL.createObjectURL(compressedFile);

  downloadLink.download = `compressed-${compressedFile.name}`;
  downloadLink.textContent = "Download Compressed Image";

  appOuputContainer.appendChild(downloadLink);
};
