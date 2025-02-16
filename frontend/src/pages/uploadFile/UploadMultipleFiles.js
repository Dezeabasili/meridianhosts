import { useState } from "react";
import axios from "axios";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import { useLocation, useNavigate } from "react-router-dom";
import { baseURL } from "../../context/authContext";

const UploadMultipleFiles = () => {
  const [filesList, setFilesList] = useState();
  const [progress, setProgress] = useState({ started: false, pc: 0 });
  const [message, setMessage] = useState();
  const axiosWithInterceptors = useAxiosInterceptors();

  const location = useLocation();
  const navigate = useNavigate();

  const sizeInMB = location?.state?.size;
  const FILE_SIZE_LIMIT = sizeInMB * 1024 * 1024; // 5MB
  const allowedExtensions = location?.state?.types;
  const fileCode = location?.state?.code;
  const id = location?.state?.id;

  const handleUpload = async (e) => {
    e.preventDefault();

    let urlArray = [];
    let public_idArray = [];
    let photoCode;
    // check if user selected at least one file
    if (!filesList.length) {
      setMessage("no file selected");
      return;
    }

    // check if any file exceeded the size limit
    let filesAboveSizeLimit = [];
    for (let i = 0; i < filesList.length; i++) {
      if (filesList[i].size > FILE_SIZE_LIMIT) {
        filesAboveSizeLimit.push(filesList[i].name);
      }
    }
    if (filesAboveSizeLimit.length) {
      let fileNames = filesAboveSizeLimit.toString();
      setMessage(`${fileNames} is(are) above the ${sizeInMB} MB size limit`);
      return;
    }

    // check if the file extension is allowed
    let indexOfExt;
    let fileName;
    let fileExt;
    let FilesNotAllowed = [];
    for (let i = 0; i < filesList.length; i++) {
      // get file name
      fileName = filesList[i].name;

      // get index of file extension
      indexOfExt = fileName.lastIndexOf(".");

      // get file extension and convert to lower case
      fileExt = fileName.slice(indexOfExt).toLowerCase();

      if (!allowedExtensions.includes(fileExt)) {
        FilesNotAllowed.push(filesList[i].name);
      }
    }
    if (FilesNotAllowed.length) {
      let fileNames = FilesNotAllowed.toString();
      setMessage(`${fileNames} is(are) not allowed`);
      return;
    }

    let numberOfFiles;
    if (filesList.length > 6) {
      numberOfFiles = 6;
    } else {
      numberOfFiles = filesList.length;
    }

    

    if (fileCode === "profilephoto") {
      await photoUpdate("profilephotos", 0, urlArray, public_idArray);
    } else if (fileCode === "hotelphoto") {
      await photoUpdate("hotelphotos", 0, urlArray, public_idArray);
    } else if (fileCode === "roomphoto") {
      for (let i = 0; i < numberOfFiles; i++) {
        await photoUpdate("roomphotos", i, urlArray, public_idArray);
      }
    } else if (fileCode === "cityphoto") {
      await photoUpdate("cityphotos", 0, urlArray, public_idArray);
    } else if (fileCode === "hoteltypephoto") {
      await photoUpdate("hoteltypephotos", 0, urlArray, public_idArray);
    } else {
      for (let i = 0; i < filesList.length; i++) {
        await photoUpdate("miscphotos", i, urlArray, public_idArray);
      }
    }

    // console.log('urlArray: ', urlArray)

    try {
      const resp = await axiosWithInterceptors.post(
        "https://meridianhosts.onrender.com/api/v1/auth/upload",
        { urlArray, fileCode, id, public_idArray },
        {
          withCredentials: true,
        }
      );
      if (fileCode == "profilephoto") {
        navigate("/users/myaccount")
      }
    } catch (err) {
      if (err.response.data.message) {
        navigate("/handleerror", {
          state: {
            message: err.response.data.message,
            path: location.pathname,
          },
        });
      } else {
        navigate("/somethingwentwrong");
      }
    }
  };

  const photoUpdate = async (folderName, index, URLArray, idArray) => {
    // generate signature
    let photoURL;
    let timestamp;
    let signature;

    try {
      const resp = await axiosWithInterceptors.post(
        "https://meridianhosts.onrender.com/api/v1/auth/generatesignature",
        { folder: folderName },
        {
          withCredentials: true,
        }
      );

      timestamp = resp.data.timestamp;
      signature = resp.data.signature;
    } catch (err) {
      if (err.response.data.message) {
        navigate("/handleerror", {
          state: {
            message: err.response.data.message,
            path: location.pathname,
          },
        });
      } else {
        navigate("/somethingwentwrong");
      }
    }

    // populate FormData

    const fd = new FormData();

    fd.append("file", filesList[index]);
    fd.append("timestamp", timestamp);
    fd.append("signature", signature);
    fd.append("api_key", process.env.REACT_APP_API_KEY);
    fd.append("folder", folderName);

    setMessage("Uploading...");
    setProgress((prev) => {
      return { ...prev, started: true };
    });

    try {
      let cloudName = process.env.REACT_APP_CLOUD_NAME;
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const res = await axios.post(api, fd, {
        onUploadProgress: (ProgressEvent) => {
          setProgress((prev) => {
            return { ...prev, pc: ProgressEvent.progress * 100 };
          });
        },
      });

      const { secure_url, public_id } = res.data;
      URLArray.push(secure_url);
      idArray.push(public_id);

      setMessage(
        `Upload successful, ${index + 1} ${
          index === 1 ? "file" : "files"
        } uploaded`
      );
    } catch (err) {
      setMessage("upload failed");
      if (err.response.data.message) {
        navigate("/handleerror", {
          state: {
            message: err.response.data.message,
            path: location.pathname,
          },
        });
      } else {
        navigate("/somethingwentwrong");
      }
    }

    // send photo urls to backend
  };

  return (
    <div>
      <h3>Upload your files here</h3>
      <form onSubmit={handleUpload}>
        <label>Choose files to upload</label>
        <br />
        {location?.state?.number === "multiple" ? (
          <input
            type="file"
            onChange={(e) => {
              setFilesList(e.target.files);
            }}
            multiple
            style={{ marginTop: "5px" }}
          />
        ) : (
          <input
            type="file"
            onChange={(e) => {
              setFilesList(e.target.files);
            }}
            style={{ marginTop: "5px" }}
          />
        )}

        <br />
        <button style={{ marginTop: "5px" }}>Upload Files</button>
      </form>
      {progress.started && (
        <progress max={"100"} value={progress.pc}></progress>
      )}
      {message && <span>{message}</span>}
      <br />
      <span
        className="uploadFMulSpan"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(-1)}
      >
        Return to previous page
      </span>
    </div>
  );
};

export default UploadMultipleFiles;
